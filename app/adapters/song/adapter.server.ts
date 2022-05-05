// import invariant from 'tiny-invariant';

import { getEmptyDetails } from '~/models/resource/adapters.server';
// import { ResourceType, ValueType } from '~/models/resource/types';
// import type { Song } from '~/adapters/song/type';

// export function dataObjectToSong(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Song {
// 	values = values ?? valuesToObject(dataObject.values);

// 	const name = composeRefFromValue(values.name, ValueType.TEXT);

// 	invariant(name, 'Missing name');

// 	return {
// 		...composeResourceBase<ResourceType.SONG>(dataObject),
// 		// additional spotify-specific fields
// 		values: {
// 			name,
// 			artist: composeRefFromValue(values.artist, ValueType.TEXT),
// 			album: composeRefFromValue(values.album, ValueType.TEXT),
// 		},
// 		// artist: values.has('artist') ? values.get('artist') : undefined,
// 	};
// }

export const getSongDetails = getEmptyDetails;
