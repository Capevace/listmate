import type { ResourceDetailsProps } from '~/models/resource/types';

import ValueGrid from '~/components/resource/value-grid';
import ResourceHeader from '~/components/resource/resource-header';
import ResourceDebugger from '~/components/resource/resource-debugger';

export default function GenericDetails({
	resource,
	details,
}: ResourceDetailsProps) {
	return (
		<ResourceHeader resource={resource} className="mx-auto w-full max-w-7xl">
			<ValueGrid values={resource.values} />
			<ResourceDebugger
				resource={resource}
				details={details}
				className="mt-5"
			/>
		</ResourceHeader>
	);
}
