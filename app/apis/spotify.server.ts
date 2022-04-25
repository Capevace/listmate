import { DataObjectRemote } from '@prisma/client';
import SpotifyWebApi from 'spotify-web-api-node';
import invariant from 'tiny-invariant';
import { saveFile } from '~/models/file.server';
import { addResourceToList } from '~/models/item.server';
import { upsertList } from '~/models/list.server';
import { Album, Artist, Song } from '~/models/resource/types';
import {
	createResource,
	findResourceByRemoteUri,
	upsertResource,
	upsertValues,
} from '~/models/resource/resource.server';
import {
	Resource,
	ResourceType,
	ResourceWithoutDefaults,
	SourceType,
} from '~/models/resource/types';
import {
	findToken,
	SourceToken,
	updateTokenData,
} from '~/models/source-token.server';
import { User } from '~/models/user.server';
import retry from '~/utilities/retry';

function logEvent(type: ResourceType, ...messages: string[]) {
	console.log(`IMPORT – Spotify – ${type}`, ...messages);
}

export type SpotifyTokenData = {
	accessToken: string;
	refreshToken: string;
};

export function createApi() {
	return new SpotifyWebApi({
		redirectUri: 'http://localhost:3000/connections/spotify/oauth',
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_SECRET,
	});
}

export async function authorizeClient(
	api: SpotifyWebApi,
	userId: User['id'],
	_token?: SourceToken
) {
	const token = _token || (await findToken(userId, SourceType.SPOTIFY));

	invariant(token && token.data, 'User is not connected to Spotify');

	const data: SpotifyTokenData = JSON.parse(token.data);

	api.setAccessToken(data.accessToken);
	api.setRefreshToken(data.refreshToken);

	const res = await retry(() => api.refreshAccessToken(), 5);

	api.setAccessToken(res.body.access_token);

	return api;
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

export async function importResource<RType extends Resource = Resource>(
	api: SourceType,
	uri: DataObjectRemote['uri'],
	data: ResourceWithoutDefaults<RType>
): Promise<RType> {
	logEvent(data.type, `Importing ${uri}`);

	let previousResource = await findResourceByRemoteUri(api, uri);

	if (previousResource) {
		return (await upsertResource({
			...previousResource,
			...data,
		})) as RType;
	}

	const createdResource = await createResource(data);
	// await attachRemoteUri(createdResource.id, SourceType.SPOTIFY, uri);

	return createdResource as RType;
}

export async function importImage(url: string, name: string) {
	try {
		const res = await fetch(url);
		const buffer = await res.arrayBuffer();

		return saveFile(name, Buffer.from(buffer));
	} catch (e) {
		console.error('Error importing image', e);
		return null;
	}
}

function retryImport<T>(fn: () => Promise<T>) {
	return retry(fn, 5);
}

type ImportParameters = {
	api: SpotifyWebApi;
	userId: User['id'];
};

type ResourceRefreshParameters = ImportParameters & {
	resource: Resource;
};
export async function refreshResourceData({
	api,
	userId,
	resource,
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
				songId: spotifyUri.replace('spotify:track:', ''),
			});

		case ResourceType.ARTIST:
			return importArtist({
				api,
				userId,
				artistId: spotifyUri.replace('spotify:artist:', ''),
			});

		case ResourceType.ALBUM:
			return importAlbum({
				api,
				userId,
				albumId: spotifyUri.replace('spotify:album:', ''),
			});

		case ResourceType.LIST:
			return importPlaylist({
				api,
				userId,
				playlistId: spotifyUri.replace('spotify:playlist:', ''),
			});

		default:
			throw new Error(
				`Resource type not supported by Spotify API: ${resource.type}`
			);
	}
}

type ArtistImportParameters = ImportParameters & {
	artistId: string;
};
export async function importArtist({
	api,
	userId,
	artistId,
}: ArtistImportParameters) {
	const { body: artistData } = await retryImport(() => api.getArtist(artistId));

	const thumbnail =
		artistData.images.length > 0
			? await importImage(
					artistData.images[0].url,
					`artist-cover-${artistData.uri}.jpg`
			  )
			: null;

	return importResource<Artist>(SourceType.SPOTIFY, artistData.uri, {
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
}

type AlbumImportParameters = ImportParameters & {
	albumId: string;
	skipSongs?: boolean;
};
export async function importAlbum(
	{ api, userId, albumId, skipSongs }: AlbumImportParameters,
	{ artistResource }: { artistResource?: Artist } = {}
) {
	const { body: albumData } = await retryImport(() => api.getAlbum(albumId));

	const artist =
		artistResource ?? albumData.artists.length > 0
			? await importArtist({ api, userId, artistId: albumData.artists[0].id })
			: null;

	const thumbnail =
		albumData.images.length > 0
			? await importImage(
					albumData.images[0].url,
					`album-cover-${albumData.uri}.jpg`
			  )
			: null;

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

	if (!skipSongs) {
		album.values.songs = [];

		for (const track of albumData.tracks.items.sort(
			(a, b) => a.track_number - b.track_number
		)) {
			// Catch the local track edge case
			try {
				const song = await importSong(
					{
						api,
						userId,
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

		await upsertValues(album);
	}

	return album;
}

type SongImportParameters = ImportParameters & {
	songId: string;
	skipPushToAlbum?: boolean;
};
export async function importSong(
	{ api, userId, songId, skipPushToAlbum }: SongImportParameters,
	{
		artistResource,
		albumResource,
	}: { artistResource?: Artist; albumResource?: Album } = {}
) {
	const { body: songData } = await retryImport(() => api.getTrack(songId));

	// This is a weird edge case, that we don't support just yet, as some important data is missing
	// TODO: support spotify local tracks
	if (songData.is_local)
		throw new Error(
			`Local tracks are not supported, ${songId} – ${songData.name}`
		);

	const artist =
		artistResource ?? songData.artists.length > 0
			? await importArtist({ api, userId, artistId: songData.artists[0].id })
			: null;

	const album =
		albumResource ??
		(await importAlbum(
			{ api, userId, albumId: songData.album.id, skipSongs: true },
			{ artistResource: artist || undefined }
		));

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

	return song;
}

type PlaylistImportParameters = ImportParameters & {
	playlistId: string;
};
export async function importPlaylist({
	api,
	userId,
	playlistId,
}: PlaylistImportParameters) {
	try {
		const { body: playlist } = await retry(
			() => api.getPlaylist(playlistId),
			5
		);
		let fileRef = null;

		if (playlist.images.length > 0) {
			try {
				const cover = playlist.images[0];
				fileRef = await importImage(
					cover.url,
					`playlist-cover-${playlistId}.jpg`
				);
			} catch (e) {
				console.warn('Could not fetch playlist cover', e);
			}
		}

		const list = await upsertList({
			userId,
			title: playlist.name,
			description: playlist.description,
			coverFileReferenceId: fileRef?.id,
		});

		for (const { track } of playlist.tracks?.items.filter(
			(item) => !item.track.is_local
		)) {
			try {
				if (await findResourceByRemoteUri(SourceType.SPOTIFY, track.uri))
					continue;

				const song = await importSong({ api, userId, songId: track.id });
				await addResourceToList(list.id, song.id);
			} catch (e) {
				console.error('Error fetching track', e);
			}
		}

		return list;
	} catch (e) {
		console.error('Error fetching playlist', e);
		return null;
	}
}
