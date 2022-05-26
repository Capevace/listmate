import type {
	Resource,
	ValueRef,
	ResourceType,
} from '~/models/resource/types';
import { composeResourceSchema, composeValueRefShape, ValueType, } from '~/models/resource/types';
import * as zod from 'zod';

export type SongData = {
	name: ValueRef<ValueType.TEXT>;
	artist: ValueRef<ValueType.RESOURCE> | null;
	album: ValueRef<ValueType.RESOURCE> | null;
};

export const SongDataSchema = composeResourceSchema(zod.object({
	name: composeValueRefShape(ValueType.TEXT, zod.string().min(1)),
	artist: composeValueRefShape(ValueType.RESOURCE).optional(),
	album: composeValueRefShape(ValueType.RESOURCE).optional(),
}));

export type Song = Resource<ResourceType.SONG, SongData>;
