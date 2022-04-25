import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
	ValueRef,
} from '~/models/resource/types';

export type AlbumData = {
	name: RawValue<string>;
	artist: ValueRef<string> | null;
	songs: (RawValue<string> | ValueRef<string>)[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Album = Resource &
	ForceResourceType<ResourceType.ALBUM> & { values: AlbumData };
