import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters.server';
import { ResourceType } from '~/models/resource/types';
import type { Album } from '~/adapters/album/type';

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
