import type {
	Resource,
	RawValue,
	ValueRef,
	ForceResourceType,
	ResourceType,
} from '~/models/resource/types';

export type SongData = {
	name: RawValue<string>;
	artist: ValueRef<string> | null;
	album: ValueRef<string> | null;
};

export type Song = Resource &
	ForceResourceType<ResourceType.SONG> & { values: SongData };
