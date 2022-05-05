import invariant from 'tiny-invariant';

import { getEmptyDetails } from '~/models/resource/adapters.server';
// import { ResourceType, ValueType } from '~/models/resource/types';
// import type { Artist } from '~/adapters/artist/type';

// export function dataObjectToArtist(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Artist {
// 	values = values ?? valuesToObject(dataObject.values);

// 	const name = composeRefFromValue(values.name, ValueType.TEXT);

// 	invariant(name, 'Missing name');

// 	return {
// 		...composeResourceBase<ResourceType.ARTIST>(dataObject),
// 		// additional spotify-specific fields
// 		values: {
// 			name,
// 		},
// 	};
// }

export const getArtistDetails = getEmptyDetails;
