import {
	Album,
	Artist,
	Song,
	Playlist,
	stringToResourceTypeOptional,
} from '~/models/resource/types';
import type { User } from '~/models/user.server';

import SpotifyWebApi from 'spotify-web-api-node';

import { upsertValues } from '~/models/resource/resource.server';
import { ResourceType, SourceType } from '~/models/resource/types';
import { updateTokenData } from '~/models/source-token.server';
import {
	ApiAuthenticationParameters,
	ImportAPI,
	importImage,
	ImportParameters,
	importResourceData,
	ResourceImportParameters,
	ResourcePlayParameters,
	ResourceSearchParameters,
	ResourceSearchResult,
	retryImport,
	ValidatedSourceURI,
} from './apis.server';
import retry from '~/utilities/retry';
import makeProgress from '~/utilities/progress';
import { addSeconds } from '~/utilities/date';

export type API = ImportAPI<SourceType.SPOTIFY, SpotifyWebApi>;

export type SpotifyTokenData = {
	accessToken: string;
	refreshToken: string;
};

/*
 * API & OAuth
 */
export function createApi(): API {
	return {
		type: SourceType.SPOTIFY,
		authenticated: false,
		service: new SpotifyWebApi({
			redirectUri: 'http://localhost:3000/connections/spotify/oauth',
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_SECRET,
		}),
	};
}

export async function authenticateApi(
	api: API,
	{ tokenData }: ApiAuthenticationParameters<SpotifyTokenData>
) {
	api.service.setAccessToken(tokenData.accessToken);
	api.service.setRefreshToken(tokenData.refreshToken);

	const res = await retry(() => api.service.refreshAccessToken(), 5);

	api.authenticated = true;
	api.service.setAccessToken(res.body.access_token);

	return api;
}

export function composeOauthUrl(userId: User['id'], state: string) {
	const api = createApi();

	const scopes = [
		'playlist-read-private',
		'playlist-read-collaborative',
		'user-library-read',
		'streaming',
		'user-read-email',
		'user-read-private',
	];

	return api.service.createAuthorizeURL(scopes, state);
}

export async function handleOauthCallback(userId: User['id'], code: string) {
	const spotifyApi = createApi();

	const data = await spotifyApi.service.authorizationCodeGrant(code);
	const expiresAt = addSeconds(new Date(), data.body.expires_in);
	const accessToken = data.body.access_token;
	const refreshToken = data.body.refresh_token;

	const tokenData: SpotifyTokenData = {
		accessToken,
		refreshToken,
	};

	return updateTokenData(userId, SourceType.SPOTIFY, tokenData, expiresAt);
}

export function getPlayerToken(api: API) {
	return { accessToken: api.service.getAccessToken() };
}

export function detectSourceType(uri: string): ValidatedSourceURI | null {
	if (uri.startsWith('spotify:')) {
		const uriType = uri.split(':')[1];
		const resourceType = stringToResourceTypeOptional(uriType);

		if (resourceType) {
			return { sourceType: SourceType.SPOTIFY, resourceType, uri };
		}
	}

	if (uri.startsWith('https://open.spotify.com/')) {
		const path = uri.replace('https://open.spotify.com/', '');
		const paths = path.split('/');
		const type = paths[0];
		const id = paths[1].split('?')[0];

		const resourceType = stringToResourceTypeOptional(uriType);

		if (resourceType) {
			return {
				sourceType: SourceType.SPOTIFY,
				resourceType,
				uri: `spotify:${type}:${id}`,
			};
		}
	}

	return null;
}

/*
 * Import Resources
 */
export async function importResourceWithType({
	api,
	userId,
	uri,
	resourceType,
	progress = makeProgress(),
}: ResourceImportParameters<API>) {
	switch (resourceType) {
		case ResourceType.SONG:
			return importSong(
				{ songId: uri.replace('spotify:track:', '') },
				{
					api,
					userId,
					progress,
				}
			);

		case ResourceType.ARTIST:
			return importArtist(
				{ artistId: uri.replace('spotify:artist:', '') },
				{
					api,
					userId,
					progress,
				}
			);

		case ResourceType.ALBUM:
			return importAlbum(
				{ albumId: uri.replace('spotify:album:', '') },
				{
					api,
					userId,
					progress,
				}
			);

		case ResourceType.PLAYLIST:
			return importPlaylist(
				{ playlistId: uri.replace('spotify:playlist:', '') },
				{
					api,
					userId,
					progress,
				}
			);

		default:
			throw new Error(
				`Resource type ${resourceType} not supported by Spotify API`
			);
	}
}

export async function searchForResourceWithType({
	api,
	resourceType,
	search,
}: ResourceSearchParameters<API>): Promise<ResourceSearchResult[]> {
	switch (resourceType) {
		case ResourceType.SONG:
			return retryImport(() =>
				api.service
					.searchTracks(search)
					.then((res) => res.body.tracks?.items ?? [])
					.then(
						(items) =>
							items.map((item) => ({
								uri: item.uri,
								title: item.name,
								subtitle: item.artists.map((artist) => artist.name).join(', '),
								thumbnailUrl: item.album.images[0]?.url ?? null,
							})) ?? []
					)
			);

		case ResourceType.ARTIST:
			return retryImport(() =>
				api.service
					.searchArtists(search)
					.then((res) => res.body.artists?.items ?? [])
					.then(
						(items) =>
							items.map((item) => ({
								uri: item.uri,
								title: item.name,
								subtitle: item.genres.join(', '),
								thumbnailUrl: item.images[0]?.url ?? null,
							})) ?? []
					)
			);

		case ResourceType.ALBUM:
			return retryImport(() =>
				api.service
					.searchAlbums(search)
					.then((res) => res.body.albums?.items ?? [])
					.then(
						(items) =>
							items.map((item) => ({
								uri: item.uri,
								title: item.name,
								subtitle: item.artists.map((album) => album.name).join(', '),
								thumbnailUrl: item.images[0]?.url ?? null,
							})) ?? []
					)
			);

		case ResourceType.PLAYLIST:
			return retryImport(() =>
				api.service
					.searchPlaylists(search)
					.then((res) => res.body.playlists?.items ?? [])
					.then(
						(items) =>
							items.map((item) => ({
								uri: item.uri,
								title: item.name,
								subtitle: item.owner.display_name ?? null,
								thumbnailUrl: item.images[0]?.url ?? null,
							})) ?? []
					)
			);

		default:
			throw new Error(
				`Resource type ${resourceType} not supported by Spotify API`
			);
	}
}

export async function playResource(
	parameters: ResourcePlayParameters<API>
): Promise<void> {
	switch (parameters.resourceType) {
		case ResourceType.SONG:
			await parameters.api.service.play({
				uris: [parameters.uri],
				device_id: parameters.deviceId,
			});
			return;

		default:
			throw new Error(
				`Resource type ${parameters.resourceType} not supported by Spotify API`
			);
	}
}

/*
 * Import implementations
 */
type ArtistImportParameters = {
	artistId: string;
};
async function importArtist(
	{ artistId }: ArtistImportParameters,
	{ api, progress = makeProgress() }: ImportParameters<API>
) {
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

	const artist = importResourceData<Artist>(
		SourceType.SPOTIFY,
		artistData.uri,
		{
			title: artistData.name,
			type: ResourceType.ARTIST,
			thumbnail: thumbnail,
			values: {
				name: { value: artistData.name },
			},
			remotes: {
				[SourceType.SPOTIFY]: artistData.uri,
			},
		}
	);

	progress(1.0);

	return artist;
}

type AlbumImportParameters = {
	albumId: string;
	skipSongs?: boolean;
	artistResource?: Artist;
};
async function importAlbum(
	{ albumId, skipSongs, artistResource }: AlbumImportParameters,
	{ api, userId, progress = makeProgress() }: ImportParameters<API>
) {
	const { body: albumData } = await retryImport(() =>
		api.service.getAlbum(albumId)
	);

	progress(0.2);

	const artistProgress = progress.sub(0.1);
	const artist =
		artistResource ?? albumData.artists.length > 0
			? await importArtist(
					{
						artistId: albumData.artists[0].id,
					},
					{ api, userId, progress: artistProgress }
			  )
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

	let album = await importResourceData<Album>(
		SourceType.SPOTIFY,
		albumData.uri,
		{
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
		}
	);

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
						songId: track.id,
						skipPushToAlbum: true,
						albumResource: album,
						artistResource: artist || undefined,
					},
					{
						api,
						userId,
						progress: songProgress,
					}
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

type SongImportParameters = {
	songId: string;
	skipPushToAlbum?: boolean;
	artistResource?: Artist;
	albumResource?: Album;
};
async function importSong(
	{
		songId,
		skipPushToAlbum,
		artistResource,
		albumResource,
	}: SongImportParameters,
	{ api, userId, progress = makeProgress() }: ImportParameters<API>
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
			? await importArtist(
					{ artistId: songData.artists[0].id },
					{
						api,
						userId,
						progress: artistProgress,
					}
			  )
			: null;

	progress(0.5);

	const albumProgress = progress.sub(0.3);
	const album =
		albumResource ??
		(await importAlbum(
			{
				albumId: songData.album.id,
				skipSongs: true,
				artistResource: artist || undefined,
			},
			{
				api,
				userId,
				progress: albumProgress,
			}
		));

	progress(0.8);

	const song = await importResourceData<Song>(
		SourceType.SPOTIFY,
		songData.uri,
		{
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
		}
	);

	if (!skipPushToAlbum) {
		album.values.songs.push({ value: song.title, ref: song.id });
		await upsertValues(album);
	}

	progress(1.0);

	return song;
}

type PlaylistImportParameters = {
	playlistId: string;
	skipSongs?: boolean;
};
async function importPlaylist(
	{ playlistId, skipSongs }: PlaylistImportParameters,
	{ api, userId, progress = makeProgress() }: ImportParameters<API>
) {
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

	let playlist = await importResourceData<Playlist>(
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
				const song = await importSong(
					{ songId: item.track.id },
					{
						api,
						userId,
						progress: songProgress,
					}
				);

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
