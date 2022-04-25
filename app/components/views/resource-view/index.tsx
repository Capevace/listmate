import type { Album } from '~/models/resource/types';
import type { AlbumDetails } from '~/adapters/album/adapter.server';

import { ResourceDetailsProps, ResourceType } from '~/models/resource/types';

import GenericDetails from './generic-details';
import AlbumDetailsView from '~/adapters/album/details-view';

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
		default:
			return <GenericDetails resource={resource} details={details} />;
	}
}
