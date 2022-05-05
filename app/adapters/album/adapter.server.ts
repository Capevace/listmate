import type { Album } from '~/adapters/album/type';
import type { Song } from '~/adapters/song/type';

import { ResourceDetails } from '~/models/resource/types';
import { resolveValueRefArray } from '~/models/resource/resource.server';

// export function dataObjectToAlbum(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Album {
// 	values = values ?? valuesToObject(dataObject.values);

// 	const name = composeRefFromValue(values.name, ValueType.TEXT);

// 	invariant(name, 'Missing name');

// 	return {
// 		...composeResourceBase<ResourceType.ALBUM>(dataObject),
// 		// additional spotify-specific fields
// 		values: {
// 			name,
// 			artist: composeRefFromValue(values.artist, ValueType.RESOURCE),
// 			songs: composeRefArrayFromValue(values.songs),
// 		},
// 	};
// }

export type AlbumDetails = ResourceDetails & {
	songs: Song[];
};

export async function getAlbumDetails(album: Album): Promise<AlbumDetails> {
	const songs = await resolveValueRefArray(album.id, 'songs');

	return { songs: songs as Song[] };
}
