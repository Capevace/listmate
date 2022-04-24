import { DataObjectRemote } from '@prisma/client';
import SpotifyWebApi from 'spotify-web-api-node';
import invariant from 'tiny-invariant';
import { saveFile } from '~/models/file.server';
import { addResourceToList } from '~/models/item.server';
import { upsertList } from '~/models/list.server';
import { Album, Artist, Song } from '~/models/resource/types';
import {
	attachRemoteUri,
	createResource,
	findResourceByRemoteUri,
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
	data: ResourceWithoutDefaults
): Promise<RType> {
	console.log('import', api, uri, data);

	let previousResource = await findResourceByRemoteUri(api, uri);

	if (previousResource) {
		return previousResource as RType;
	}

	const createdResource = await createResource(data);
	await attachRemoteUri(createdResource.id, SourceType.SPOTIFY, uri);

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

export async function importArtist(artist: SpotifyApi.ArtistObjectFull) {
	const thumbnail =
		artist.images.length > 0
			? await importImage(
					artist.images[0].url,
					`artist-cover-${artist.uri}.jpg`
			  )
			: null;

	return importResource<Artist>(SourceType.SPOTIFY, artist.uri, {
		title: artist.name,
		type: ResourceType.ARTIST,
		thumbnail: thumbnail,
		values: {
			name: { value: artist.name },
		},
	});
}

export async function importAlbum(
	album: SpotifyApi.AlbumObjectSimplified,
	artist: Artist
) {
	const thumbnail =
		album.images.length > 0
			? await importImage(album.images[0].url, `album-cover-${album.uri}.jpg`)
			: null;

	return importResource<Album>(SourceType.SPOTIFY, album.uri, {
		title: album.name,
		type: ResourceType.ALBUM,
		thumbnail: thumbnail,
		values: {
			name: { value: album.name },
			artist: artist ? { value: artist.title, ref: artist.id } : null,
		},
	});
}

export async function importTrack(
	api: SpotifyWebApi,
	track: SpotifyApi.TrackObjectFull
) {
	const { body: artistData } = await retry(
		() => api.getArtist(track.artists[0].id),
		5
	);
	const artist = await importArtist(artistData);

	const { body: albumData } = await retry(
		() => api.getAlbum(track.album.id),
		5
	);
	const album = await importAlbum(albumData, artist);

	return importResource<Song>(SourceType.SPOTIFY, track.uri, {
		title: track.name,
		type: ResourceType.SONG,
		thumbnail: album.thumbnail,
		values: {
			name: { value: track.name },
			artist: artist ? { value: artist.title, ref: artist.id } : null,
			album: album ? { value: album.title, ref: album.id } : null,
		},
	});
}

export async function importPlaylist(
	api: SpotifyWebApi,
	userId: User['id'],
	playlistId: string
) {
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
				const resource = await importTrack(api, track);
				await addResourceToList(list.id, resource.id);
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
