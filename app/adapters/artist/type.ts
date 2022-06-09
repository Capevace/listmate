import type { DataSchema, TextData } from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type { Resource, ResourceType } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';

export type ArtistData = {
	name: TextData;
};

export const ArtistDataSchema: DataSchema<ArtistData> = {
	name: Schemas[ValueType.TEXT]().min(1), // title is required
};

export type Artist = Resource<ResourceType.ARTIST, ArtistData>;
