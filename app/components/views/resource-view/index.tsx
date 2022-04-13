import type { Resource } from '~/models/resource/resource.types';
import ResourceHeader from './resource-header';
import ResourceDetails from './resource-details';

export type ResourceViewProps = {
	resource: Resource;
};

export default function ResourceView({ resource }: ResourceViewProps) {
	return (
		<div className="relative my-5 border border-gray-700 bg-gray-800 px-10 py-8 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<ResourceHeader resource={resource} />

			<ResourceDetails resource={resource} />
		</div>
	);
}
