import { valueListToMap, ValueMap } from '../adapters/remote';
import {
	CompleteDataObjectRemote,
	composeResourceBase,
	Resource,
	ResourceType,
	SourceType,
} from './resource';

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

export function dataObjectToAlbum(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Album {
	values = values ?? valueListToMap(remote.values);

	if (!values.has('name')) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.ALBUM, SourceType>(remote),
		// additional spotify-specific fields
		name: values.get('name'),
	};
}

export function dataObjectToArtist(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Artist {
	values = values ?? valueListToMap(remote.values);

	if (!values.has('name')) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.ARTIST, SourceType>(remote),
		// additional spotify-specific fields
		name: values.get('name'),
	};
}

export function dataObjectToSong(
	remote: CompleteDataObjectRemote,
	values?: ValueMap
): Song {
	values = values ?? valueListToMap(remote.values);

	if (!values.has('name')) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.SONG, SourceType>(remote),
		// additional spotify-specific fields
		name: values.get('name'),
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
