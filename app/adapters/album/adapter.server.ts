import type { Album, AlbumDetails, Song } from '~/models/resource/types';
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

export async function getAlbumDetails(album: Album): Promise<AlbumDetails> {
	const songs = await resolveValueRefArray(album.id, 'songs');

	return { songs: songs as Song[] };
}
