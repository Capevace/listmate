import type { Collection } from './type';

import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefArrayFromValue,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	valuesToObject,
} from '~/models/resource/adapters.server';
import {
	Resource,
	ResourceDetails,
	ResourceType,
	stringToResourceType,
} from '~/models/resource/types';
import { resolveValueRefArray } from '~/models/resource/resource.server';

export function dataObjectToCollection(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Collection {
	values = values ?? valuesToObject(dataObject.values);

	const name = composeRefFromValue(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.COLLECTION>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			source: composeRefFromValue<ResourceType>(
				values.source,
				stringToResourceType
			),
			description: composeRefFromValue(values.description),
			items: composeRefArrayFromValue<string>(values.items),
		},
	};
}

export type CollectionDetails<TResource extends Resource> = ResourceDetails & {
	items: TResource[];
};

export async function getCollectionDetails<
	TResource extends Resource = Resource
>(collection: Collection<TResource>): Promise<CollectionDetails<TResource>> {
	const items = await resolveValueRefArray(collection.id, 'items');

	return { items: items as TResource[] };
}
