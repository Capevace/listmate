import type { Resource, ValueRef, ResourceType } from '~/models/resource/types';
import { ValueType } from '~/models/resource/types';
import * as zod from 'zod';

export type SongData = {
	name: ValueRef<ValueType.TEXT>;
	artist: ValueRef<ValueType.RESOURCE> | null;
	album: ValueRef<ValueType.RESOURCE> | null;
};

type RValue = { type: ValueType; value: string };

const resourceRefSchema = () => zod.string().uuid();

export const SongDataSchema = {
	name: zod.string().min(1),
	artist: zod.string().optional(),
	album: zod.string().optional(),
};

export type Song = Resource<ResourceType.SONG, SongData>;
