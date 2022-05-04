import type { Album, Collection, Playlist } from '~/models/resource/types';
import type { AlbumDetails } from '~/adapters/album/adapter.server';
import type { PlaylistDetails } from '~/adapters/playlist/adapter.server';
import type { CollectionDetails } from '~/adapters/collection/adapter.server';

import { ResourceDetailsProps, ResourceType } from '~/models/resource/types';

import GenericDetails from './generic-details';
import AlbumDetailsView from '~/adapters/album/details-view';
import PlaylistDetailsView from '~/adapters/playlist/details-view';
import CollectionDetailsView from '~/adapters/collection/details-view';
import VideoDetailsView from '~/adapters/video/details-view';
import { VideoDetails } from '~/adapters/video/adapter.server';
import { Video } from '~/adapters/video/type';

export default function ResourceView({
	resource,
	details,
}: ResourceDetailsProps) {
	switch (resource.type) {
		case ResourceType.ALBUM:
			return (
				<AlbumDetailsView
					resource={resource as Album}
					details={details as AlbumDetails}
				/>
			);
		case ResourceType.COLLECTION:
			return (
				<CollectionDetailsView
					resource={resource as Collection}
					details={details as CollectionDetails}
				/>
			);
		case ResourceType.PLAYLIST:
			return (
				<PlaylistDetailsView
					resource={resource as Playlist}
					details={details as PlaylistDetails}
				/>
			);
		case ResourceType.VIDEO:
			return (
				<VideoDetailsView
					resource={resource as Video}
					details={details as VideoDetails}
				/>
			);
		default:
			return <GenericDetails resource={resource} details={details} />;
	}
}
