import type { Playlist } from './type';
import type {  Song } from '~/models/resource/types';

import {
	CollectionDetails,
	getCollectionDetails,
} from '~/adapters/collection/adapter.server';

// export function dataObjectToPlaylist(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Playlist {
// 	values = values ?? valuesToObject(dataObject.values);

// 	return dataObjectToCollection<Song, ResourceType.PLAYLIST>(
// 		dataObject,
// 		values
// 	) as Playlist;
// 	// const name = composeRefFromValue(values.name);

// 	// invariant(name, 'Missing name');

// 	// return {
// 	// 	...composeResourceBase<ResourceType.COLLECTION>(dataObject),
// 	// 	// additional spotify-specific fields
// 	// 	values: {
// 	// 		name,
// 	// 		source: composeRefFromValue<ResourceType>(
// 	// 			values.source,
// 	// 			stringToResourceType
// 	// 		),
// 	// 		description: composeRefFromValue(values.description),
// 	// 		items: composeRefArrayFromValue<string>(values.items),
// 	// 	},
// 	// };
// }

export type PlaylistDetails = CollectionDetails<Song> & {};

export async function getPlaylistDetails(
	playlist: Playlist
): Promise<PlaylistDetails> {
	return getCollectionDetails(playlist);
}
