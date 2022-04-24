import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
} from '~/models/resource/types';

export type ArtistData = {
	name: RawValue<string>;
};

export type Artist = Resource &
	ForceResourceType<ResourceType.ARTIST> & { values: ArtistData };
