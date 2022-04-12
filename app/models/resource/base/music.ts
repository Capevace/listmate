import { DataObject } from '@prisma/client';
import invariant from 'tiny-invariant';
import {
	CompleteDataObject,
	composeResourceBase,
	valueListToMap,
	ValueMap,
} from '../adapters/remote';
import {
	composeRefFromValue,
	Resource,
	ValueRef,
	ResourceType,
	RawValue,
} from './resource';

export type ForceResourceType<T extends ResourceType> = {
	type: T;
};

export type ArtistData = {
	name: RawValue<string>;
};

export type Artist = Resource &
	ForceResourceType<ResourceType.ARTIST> & { values: ArtistData };

export type AlbumData = {
	name: RawValue<string>;
	artist: ValueRef<string> | null;
};

export type Album = Resource &
	ForceResourceType<ResourceType.ALBUM> & { values: AlbumData };

export type SongData = {
	name: RawValue<string>;
	artist: ValueRef<string> | null;
	album: ValueRef<string> | null;
};

export type Song = Resource &
	ForceResourceType<ResourceType.SONG> & { values: SongData };

export type CreateAlbumParameters = AlbumData & {
	artist?: ArtistData | Artist;
};

export async function dataObjectToAlbum(
	dataObject: CompleteDataObject,
	values?: ValueMap
): Promise<Album> {
	values = values ?? valueListToMap(dataObject.values);

	const name = composeRefFromValue<string>(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.ALBUM>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			artist: composeRefFromValue<string>(values.artist),
		},
	};
}

export async function dataObjectToArtist(
	dataObject: CompleteDataObject,
	values?: ValueMap
): Promise<Artist> {
	values = values ?? valueListToMap(dataObject.values);

	const name = composeRefFromValue<string>(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.ARTIST>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
		},
	};
}

export async function dataObjectToSong(
	dataObject: CompleteDataObject,
	values?: ValueMap
): Promise<Song> {
	values = values ?? valueListToMap(dataObject.values);

	const name = composeRefFromValue<string>(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.SONG>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			artist: composeRefFromValue<string>(values.artist),
			album: composeRefFromValue<string>(values.album),
		},
		// artist: values.has('artist') ? values.get('artist') : undefined,
	};
}

// export function dataObjectToArtist(
// 	dataObject: CompleteDataObject,
// 	values?: Map<string, any>
// ): Album {
// 	values = values ?? valueListToMap(dataObject.values);

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

/**
 * album.name.value
 * song.name.value
 * song.album.value
 * song.album.ref
 * resource.sub.value
 * resource.sub.ref
 */
