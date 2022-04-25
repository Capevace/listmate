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
	SourceType,
	stringToSourceType,
} from '~/models/resource/types';
import { resolveValueRefArray } from '~/models/resource/resource.server';

export function dataObjectToCollection<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Collection<TResource, TResourceType> {
	values = values ?? valuesToObject(dataObject.values);

	const name = composeRefFromValue(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<TResourceType>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			source: composeRefFromValue<SourceType>(
				values.source,
				stringToSourceType
			),
			description: composeRefFromValue(values.description),
			items: composeRefArrayFromValue<string>(values.items),
		},
	};
}

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
