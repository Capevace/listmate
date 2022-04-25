import type {
	Resource,
	RawValue,
	ValueRef,
	ForceResourceType,
	ResourceType,
	Artist,
	Album,
} from '~/models/resource/types';

export type SongData = {
	name: RawValue<string>;
	artist: ValueRef<string, Artist> | null;
	album: ValueRef<string, Album> | null;
};

export type Song = Resource &
	ForceResourceType<ResourceType.SONG> & { values: SongData };
