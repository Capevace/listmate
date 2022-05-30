import type { DataSchema } from '~/models/resource/refs';
import type {
	Collection,
	CollectionData,
	CollectionDetails,
	ResourceType,
	Song,
} from '~/models/resource/types';
import { CollectionDataSchema } from '~/models/resource/types';

export type PlaylistData = CollectionData & {};

export type Playlist = Collection<ResourceType.PLAYLIST> & {};
export type PlaylistDetails = CollectionDetails<Song> & {};

export const PlaylistDataSchema: DataSchema<PlaylistData> =
	CollectionDataSchema;
