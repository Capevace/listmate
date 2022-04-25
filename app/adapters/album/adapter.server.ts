import type { Album } from '~/adapters/album/type';
import type { Song } from '~/adapters/song/type';

import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefArrayFromValue,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters.server';
import { Artist, ResourceDetails, ResourceType } from '~/models/resource/types';
import {
	findResources,
	resolveValueRefArray,
} from '~/models/resource/resource.server';

export function dataObjectToAlbum(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Album {
	values = values ?? valuesToObject(dataObject.values);

	const name = composeRefFromValue<string>(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.ALBUM>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			artist: composeRefFromValue<string, Artist>(values.artist),
			songs: composeRefArrayFromValue<string>(values.songs),
		},
	};
}

export type AlbumDetails = ResourceDetails & {
	songs: Song[];
};

export async function getAlbumDetails(album: Album): Promise<AlbumDetails> {
	const songs = await resolveValueRefArray(album.id, 'songs');

	return { songs: songs as Song[] };
}
