import type { Resource, RawValue, ResourceType } from '~/models/resource/types';

export type ArtistData = {
	name: RawValue<string>;
};

export type Artist = Resource<ResourceType.ARTIST, ArtistData>;
