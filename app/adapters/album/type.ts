import type { DataSchema, ListData, TextData } from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type { Resource, ResourceType, Song } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';

export type AlbumData = {
	name: TextData;
	artist: TextData;
	songs: ListData;
};

export const AlbumDataSchema: DataSchema<AlbumData> = {
	name: Schemas[ValueType.TEXT]().min(1), // title is required
	artist: Schemas[ValueType.TEXT]().optional(),
	songs: Schemas[ValueType.LIST]().optional(),
};

export type Album = Resource<ResourceType.ALBUM, AlbumData>;
export type AlbumDetails = { songs: Song[] };
