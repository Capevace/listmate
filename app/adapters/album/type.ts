import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
	ValueRef,
	Song,
	Artist,
} from '~/models/resource/types';

export type AlbumData = {
	name: RawValue<string>;
	artist: ValueRef<string, Artist> | null;
	songs: (RawValue<string> | ValueRef<string, Song>)[];

	// release_date: '1976-10-14';
	// release_date_precision: 'day';
	// total_tracks: 13;
};

export type Album = Resource<ResourceType.ALBUM, AlbumData>;
