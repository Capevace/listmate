import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
	ValueRef,
	SourceType,
} from '~/models/resource/types';

export type CollectionData<TResource extends Resource> = {
	name: RawValue<string>;
	description: RawValue<string> | null;
	source: RawValue<SourceType> | null;
	items: (RawValue<string> | ValueRef<string, TResource>)[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Collection<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
> = Resource<TResourceType, CollectionData<TResource>>;
