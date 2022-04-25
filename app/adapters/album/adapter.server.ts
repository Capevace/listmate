import type { Album } from '~/adapters/album/type';
import type { Song } from '~/adapters/song/type';

import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters.server';
import { ResourceDetails, ResourceType } from '~/models/resource/types';
import { findResources } from '~/models/resource/resource.server';

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
			artist: composeRefFromValue<string>(values.artist),
		},
	};
}

export type AlbumDetails = ResourceDetails & {
	songs: Song[];
};

export async function getAlbumDetails(album: Album): Promise<AlbumDetails> {
	const songs = await findResources({
		type: ResourceType.SONG,
		valueRef: { key: 'album', ref: album.id },
	});

	return { songs: songs as Song[] };
}
