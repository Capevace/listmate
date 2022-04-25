import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
	ValueRef,
} from '~/models/resource/types';

export type CollectionData<TResource extends Resource> = {
	name: RawValue<string>;
	description: RawValue<string> | null;
	source: RawValue<ResourceType> | null;
	items: (RawValue<string> | ValueRef<string, TResource>)[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Collection<TResource extends Resource = Resource> = Resource &
	ForceResourceType<ResourceType.COLLECTION> & {
		values: CollectionData<TResource>;
	};
