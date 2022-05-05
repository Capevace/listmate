import type {
	Resource,
	ResourceType,
	ValueRef,
	ValueType,
} from '~/models/resource/types';

export type CollectionData<TResource extends Resource> = {
	name: ValueRef<ValueType.TEXT>;
	description: ValueRef<ValueType.TEXT> | null;
	source: ValueRef<ValueType.SOURCE_TYPE> | null;
	items: ValueRef<ValueType.RESOURCE>[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Collection<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
> = Resource<TResourceType, CollectionData<TResource>>;
