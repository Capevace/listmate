import type {
	Resource,
	ForceResourceType,
	ResourceType,
	CollectionData,
	Song,
	Collection,
} from '~/models/resource/types';

export type PlaylistData = CollectionData<Song> & {};

export type Playlist = Collection<Song, ResourceType.PLAYLIST> & {};
