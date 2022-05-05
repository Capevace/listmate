import type {
	Resource,
	ResourceType,
	ValueType,
	ValueRef,
} from '~/models/resource/types';

export type ArtistData = {
	name: ValueRef<ValueType.TEXT>;
};

export type Artist = Resource<ResourceType.ARTIST, ArtistData>;
