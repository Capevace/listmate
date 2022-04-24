import { ResourceType, Resource } from '~/models/resource/types';

import GenericDetails from './details/generic-details';

export type ResourceDetailsProps = {
	resource: Resource;
};

export default function ResourceDetails({ resource }: ResourceDetailsProps) {
	switch (resource.type) {
		case ResourceType.SONG:
		default:
			return <GenericDetails resource={resource} />;
	}
}
