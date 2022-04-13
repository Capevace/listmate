import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters/adapters.server';
import { ResourceType } from '~/models/resource/resource.server';
import type { Album } from '~/models/resource/adapters/album/type';

export async function dataObjectToAlbum(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Promise<Album> {
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
