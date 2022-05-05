import type { Collection } from './type';

import {
	Resource,
	ResourceDetails,
	ResourceType,
} from '~/models/resource/types';
import { resolveValueRefArray } from '~/models/resource/resource.server';

// export function dataObjectToCollection<
// 	TResource extends Resource = Resource,
// 	TResourceType extends ResourceType = ResourceType.COLLECTION
// >(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Collection<TResource, TResourceType> {
// 	values = values ?? valuesToObject(dataObject.values);

// 	const name = composeRefFromValue(values.name, ValueType.TEXT);

// 	invariant(name, 'Missing name');

// 	return {
// 		...composeResourceBase<TResourceType>(dataObject),
// 		// additional spotify-specific fields
// 		values: {
// 			name,
// 			source: composeRefFromValue(values.source, ValueType.SOURCE_TYPE),
// 			description: composeRefFromValue(values.description, ValueType.TEXT),
// 			items: composeRefArrayFromValue(values.items),
// 		},
// 	};
// }

export type CollectionDetails<TResource extends Resource = Resource> =
	ResourceDetails & {
		items: TResource[];
	};

export async function getCollectionDetails<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>(
	collection: Collection<TResource, TResourceType>
): Promise<CollectionDetails<TResource>> {
	const items = await resolveValueRefArray(collection.id, 'items');

	return { items: items as TResource[] };
}
