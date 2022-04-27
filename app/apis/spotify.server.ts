import type { Album, Artist, Song, Playlist } from '~/models/resource/types';
import type { User } from '~/models/user.server';

import SpotifyWebApi from 'spotify-web-api-node';
import invariant from 'tiny-invariant';

import { upsertValues } from '~/models/resource/resource.server';
import { Resource, ResourceType, SourceType } from '~/models/resource/types';
import {
	findToken,
	SourceToken,
	updateTokenData,
} from '~/models/source-token.server';
import {
	ImportAPI,
	importImage,
	ImportParameters,
	importResource,
	retryImport,
} from './apis.server';
import retry from '~/utilities/retry';
import makeProgress from '~/utilities/progress';
import { addSeconds } from '~/utilities/date';

export type SpotifyTokenData = {
	accessToken: string;
	refreshToken: string;
};

export function createApi(): ImportAPI<SpotifyWebApi> {
	return {
		authenticated: false,
		service: new SpotifyWebApi({
			redirectUri: 'http://localhost:3000/connections/spotify/oauth',
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_SECRET,
		}),
	};
}

export async function authenticateApi(
	api: ImportAPI<SpotifyWebApi>,
	userId: User['id'],
	_token?: SourceToken
) {
	const token = _token ?? (await findToken(userId, SourceType.SPOTIFY));

	invariant(token && token.data, 'User is not connected to Spotify');

	const data: SpotifyTokenData = JSON.parse(token.data);

	api.service.setAccessToken(data.accessToken);
	api.service.setRefreshToken(data.refreshToken);

	const res = await retry(() => api.service.refreshAccessToken(), 5);

	api.authenticated = true;
	api.service.setAccessToken(res.body.access_token);

	return api;
}

export function composeOauthUrl({
	userId,
	state,
}: {
	userId: User['id'];
	state: string;
}) {
	const api = createApi();

	const scopes = [
		'playlist-read-private',
		'playlist-read-collaborative',
		'user-library-read',
	];

	return api.service.createAuthorizeURL(scopes, state);
}

export async function handleOauthCallback({
	userId,
	code,
}: {
	userId: User['id'];
	code: string;
}) {
	const spotifyApi = createApi();

	const data = await spotifyApi.service.authorizationCodeGrant(code);
	const expiresAt = addSeconds(new Date(), data.body.expires_in);
	const accessToken = data.body.access_token;
	const refreshToken = data.body.refresh_token;

	await updateAPITokens(userId, accessToken, refreshToken, expiresAt);
}

export function updateAPITokens(
	userId: User['id'],
	accessToken: string,
	refreshToken: string,
	expiresAt: Date
) {
	const data: SpotifyTokenData = { accessToken, refreshToken };

	return updateTokenData(userId, SourceType.SPOTIFY, data, expiresAt);
}

type ResourceRefreshParameters = ImportParameters<SpotifyWebApi> & {
	resource: Resource;
};
export async function refreshResourceData({
	api,
	userId,
	resource,
	progress = makeProgress(),
}: ResourceRefreshParameters) {
	const spotifyUri = resource.remotes[SourceType.SPOTIFY];

	if (!spotifyUri) {
		throw new Error('Resource is not connected with Spotify');
	}

	switch (resource.type) {
		case ResourceType.SONG:
			return importSong({
				api,
				userId,
				progress,
				songId: spotifyUri.replace('spotify:track:', ''),
			});

		case ResourceType.ARTIST:
			return importArtist({
				api,
				userId,
				progress,
				artistId: spotifyUri.replace('spotify:artist:', ''),
			});

		case ResourceType.ALBUM:
			return importAlbum({
				api,
				userId,
				progress,
				albumId: spotifyUri.replace('spotify:album:', ''),
			});

		case ResourceType.PLAYLIST:
			return importPlaylist({
				api,
				userId,
				progress,
				playlistId: spotifyUri.replace('spotify:playlist:', ''),
			});

		default:
			throw new Error(
				`Resource type not supported by Spotify API: ${resource.type}`
			);
	}
}

type ArtistImportParameters = ImportParameters<SpotifyWebApi> & {
	artistId: string;
};
export async function importArtist({
	api,
	userId,
	progress = makeProgress(),

	artistId,
}: ArtistImportParameters) {
	const { body: artistData } = await retryImport(() =>
		api.service.getArtist(artistId)
	);

	progress(0.4);

	const thumbnail =
		artistData.images.length > 0
			? await importImage(
					artistData.images[0].url,
					`artist-cover-${artistData.uri}.jpg`
			  )
			: null;

	progress(0.7);

	const artist = importResource<Artist>(SourceType.SPOTIFY, artistData.uri, {
		title: artistData.name,
		type: ResourceType.ARTIST,
		thumbnail: thumbnail,
		values: {
			name: { value: artistData.name },
		},
		remotes: {
			[SourceType.SPOTIFY]: artistData.uri,
		},
	});

	progress(1.0);

	return artist;
}

type AlbumImportParameters = ImportParameters<SpotifyWebApi> & {
	albumId: string;
	skipSongs?: boolean;
};
export async function importAlbum(
	{
		api,
		userId,
		progress = makeProgress(),

		albumId,
		skipSongs,
	}: AlbumImportParameters,
	{ artistResource }: { artistResource?: Artist } = {}
) {
	const { body: albumData } = await retryImport(() =>
		api.service.getAlbum(albumId)
	);

	progress(0.2);

	const artistProgress = progress.sub(0.1);
	const artist =
		artistResource ?? albumData.artists.length > 0
			? await importArtist({
					api,
					userId,
					progress: artistProgress,
					artistId: albumData.artists[0].id,
			  })
			: null;

	progress(0.3);

	const thumbnail =
		albumData.images.length > 0
			? await importImage(
					albumData.images[0].url,
					`album-cover-${albumData.uri}.jpg`
			  )
			: null;

	progress(0.4);

	let album = await importResource<Album>(SourceType.SPOTIFY, albumData.uri, {
		title: albumData.name,
		type: ResourceType.ALBUM,
		thumbnail: thumbnail,
		values: {
			name: { value: albumData.name },
			artist: artist ? { value: artist.title, ref: artist.id } : null,
			songs: [],
		},
		remotes: {
			[SourceType.SPOTIFY]: albumData.uri,
		},
	});

	progress(0.5);

	if (!skipSongs) {
		album.values.songs = [];

		for (const track of albumData.tracks.items.sort(
			(a, b) => a.track_number - b.track_number
		)) {
			// Catch the local track edge case
			try {
				const songProgress = progress.sub(0.45 / albumData.tracks.items.length);

				const song = await importSong(
					{
						api,
						userId,
						progress: songProgress,
						songId: track.id,
						skipPushToAlbum: true,
					},
					{ albumResource: album, artistResource: artist || undefined }
				);

				album.values.songs.push({ value: song.title, ref: song.id });
			} catch (e) {
				// TODO: Proper import error handling
				console.error(e);
			}
		}

		progress(0.95);

		await upsertValues(album);
	}

	progress(1.0);

	return album;
}

type SongImportParameters = ImportParameters<SpotifyWebApi> & {
	songId: string;
	skipPushToAlbum?: boolean;
};
export async function importSong(
	{
		api,
		userId,
		progress = makeProgress(),

		songId,
		skipPushToAlbum,
	}: SongImportParameters,
	{
		artistResource,
		albumResource,
	}: { artistResource?: Artist; albumResource?: Album } = {}
) {
	const { body: songData } = await retryImport(() =>
		api.service.getTrack(songId)
	);

	progress(0.4);

	// This is a weird edge case, that we don't support just yet, as some important data is missing
	// TODO: support spotify local tracks
	if (songData.is_local)
		throw new Error(
			`Local tracks are not supported, ${songId} – ${songData.name}`
		);

	const artistProgress = progress.sub(0.1);
	const artist =
		artistResource ?? songData.artists.length > 0
			? await importArtist({
					api,
					userId,
					progress: artistProgress,
					artistId: songData.artists[0].id,
			  })
			: null;

	progress(0.5);

	const albumProgress = progress.sub(0.3);
	const album =
		albumResource ??
		(await importAlbum(
			{
				api,
				userId,
				progress: albumProgress,
				albumId: songData.album.id,
				skipSongs: true,
			},
			{ artistResource: artist || undefined }
		));

	progress(0.8);

	const song = await importResource<Song>(SourceType.SPOTIFY, songData.uri, {
		title: songData.name,
		type: ResourceType.SONG,
		thumbnail: album.thumbnail,
		values: {
			name: { value: songData.name },
			artist: artist ? { value: artist.title, ref: artist.id } : null,
			album: album ? { value: album.title, ref: album.id } : null,
		},
		remotes: {
			[SourceType.SPOTIFY]: songData.uri,
		},
	});

	if (!skipPushToAlbum) {
		album.values.songs.push({ value: song.title, ref: song.id });
		await upsertValues(album);
	}

	progress(1.0);

	return song;
}

type PlaylistImportParameters = ImportParameters<SpotifyWebApi> & {
	playlistId: string;
	skipSongs?: boolean;
};
export async function importPlaylist({
	api,
	userId,
	progress = makeProgress(),

	playlistId,
	skipSongs,
}: PlaylistImportParameters) {
	const { body: playlistData } = await retry(
		() => api.service.getPlaylist(playlistId),
		5
	);

	progress(0.1);

	let fileRef = null;

	if (playlistData.images.length > 0) {
		try {
			const cover = playlistData.images[0];
			fileRef = await importImage(
				cover.url,
				`playlist-cover-${playlistId}.jpg`
			);
		} catch (e) {
			console.warn('Could not fetch playlist cover', e);
		}
	}

	progress(0.2);

	let playlist = await importResource<Playlist>(
		SourceType.SPOTIFY,
		playlistData.uri,
		{
			title: playlistData.name,
			type: ResourceType.PLAYLIST,
			thumbnail: fileRef,
			values: {
				name: { value: playlistData.name },
				description: playlistData.description
					? { value: playlistData.description }
					: null,
				items: [],
				source: { value: SourceType.SPOTIFY },
			},
			remotes: {
				[SourceType.SPOTIFY]: playlistData.uri,
			},
		}
	);

	progress(0.3);

	if (!skipSongs) {
		playlist.values.items = [];

		for (const item of playlistData.tracks.items) {
			const songProgress = progress.sub(0.6 / playlistData.tracks.items.length);

			// Catch the local track edge case
			try {
				const song = await importSong({
					api,
					userId,
					progress: songProgress,

					songId: item.track.id,
				});

				playlist.values.items.push({ value: song.title, ref: song.id });
			} catch (e) {
				// TODO: Proper import error handling
				console.error(e);
			}
		}

		progress(0.9);

		await upsertValues(playlist);
	}

	progress(1.0);

	return playlist;
}
