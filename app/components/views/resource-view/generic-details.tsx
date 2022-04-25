import type { ResourceDetailsProps } from '~/models/resource/types';

import ValueGrid from '~/components/resource/value-grid';
import ResourceHeader from '~/components/resource/resource-header';

export default function GenericDetails({ resource }: ResourceDetailsProps) {
	return (
		<ResourceHeader resource={resource} className="mx-auto w-full max-w-7xl">
			<ValueGrid values={resource.values} />
		</ResourceHeader>
	);
}
