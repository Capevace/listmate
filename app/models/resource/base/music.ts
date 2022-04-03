import invariant from 'tiny-invariant';
import {
	CompleteDataObjectRemote,
	composeResourceBase,
	getValueAsResource,
	valueListToMap,
	ValueMap,
} from '../adapters/remote';
import { Resource, ResourceType, SourceType } from './resource';

export type ForceResourceType<T extends ResourceType> = {
	type: T;
};

export type ArtistData = {
	name: string;
};

export type Artist = Resource &
	ForceResourceType<ResourceType.ARTIST> &
	ArtistData;

export type AlbumData = {
	name: string;
	artist?: ArtistData;
};

export type Album = Resource &
	ForceResourceType<ResourceType.ALBUM> &
	AlbumData;

export type SongData = {
	name: string;
	artist?: ArtistData;
	album?: AlbumData;
};

export type Song = Resource & ForceResourceType<ResourceType.SONG> & SongData;

export type CreateAlbumParameters = AlbumData & {
	artist?: ArtistData | Artist;
};

export async function dataObjectToAlbum(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Promise<Album> {
	values = values ?? valueListToMap(remote.values);

	invariant(values.name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.ALBUM, SourceType>(remote),
		// additional spotify-specific fields
		name: values.name.value,
		artist: (await getValueAsResource(values.artist)) as Artist,
	};
}

export async function dataObjectToArtist(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Promise<Artist> {
	values = values ?? valueListToMap(remote.values);

	invariant(values.name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.ARTIST, SourceType>(remote),
		// additional spotify-specific fields
		name: values.name.value,
	};
}

export async function dataObjectToSong(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Promise<Song> {
	values = values ?? valueListToMap(remote.values);

	invariant(values.name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.SONG, SourceType>(remote),
		// additional spotify-specific fields
		name: values.name.value,
		artist: (await getValueAsResource(values.artist)) as Artist,
		album: (await getValueAsResource(values.album)) as Album,
		// artist: values.has('artist') ? values.get('artist') : undefined,
	};
}

// export function dataObjectToArtist(
// 	remote: CompleteDataObjectRemote,
// 	values?: Map<string, any>
// ): Album {
// 	values = values ?? valueListToMap(remote.values);

// 	if (!values.has('name')) {
// 		throw new Error('Missing name');
// 	}

// 	return {
// 		...composeResourceBase<ResourceType.ALBUM, SourceType>(remote),
// 		// additional spotify-specific fields
// 		name: values.get('name'),
// 		artist: values.has('artist')
// 			? dataObjectToArtist(remote, values.get('artist'))
// 	};
// }
