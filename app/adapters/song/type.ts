import type {
	Resource,
	ValueRef,
	ResourceType,
	ValueType,
} from '~/models/resource/types';

export type SongData = {
	name: ValueRef<ValueType.TEXT>;
	artist: ValueRef<ValueType.RESOURCE> | null;
	album: ValueRef<ValueType.RESOURCE> | null;
};

export type Song = Resource<ResourceType.SONG, SongData>;
