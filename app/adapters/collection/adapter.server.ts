import { resolveValueRefArray } from '~/models/resource/resource.server';
import type { Resource, ResourceType } from '~/models/resource/types';
import type { Collection, CollectionDetails } from './type';

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

export async function getCollectionDetails<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>(
	collection: Collection<TResourceType>
): Promise<CollectionDetails<TResource>> {
	const items = await resolveValueRefArray(collection.id, 'items');

	return { items: items as TResource[] };
}
