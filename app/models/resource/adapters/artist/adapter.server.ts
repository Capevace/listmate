import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters/adapters.server';
import { ResourceType } from '~/models/resource/resource.types';
import type { Artist } from '~/models/resource/adapters/artist/type';

export function dataObjectToArtist(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Artist {
	values = values ?? valuesToObject(dataObject.values);

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
