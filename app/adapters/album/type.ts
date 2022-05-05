import type {
	Resource,
	ResourceType,
	ValueRef,
	ValueType,
} from '~/models/resource/types';

export type AlbumData = {
	name: ValueRef<ValueType.TEXT>;
	artist: ValueRef<ValueType.RESOURCE> | null;
	songs: ValueRef<ValueType.RESOURCE>[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Album = Resource<ResourceType.ALBUM, AlbumData>;
