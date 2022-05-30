import type { DataSchema, TextData } from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type { Resource, ResourceType } from '~/models/resource/types';
import { ValueType } from '~/models/resource/types';

export type SongData = {
	name: TextData;
	artist: TextData;
	album: TextData;
};

export const SongDataSchema: DataSchema<SongData> = {
	name: Schemas[ValueType.TEXT]().min(1), // name is required
	artist: Schemas[ValueType.TEXT]().optional(),
	album: Schemas[ValueType.TEXT]().optional(),
};

export type Song = Resource<ResourceType.SONG, SongData>;
