import type { ResourceDetailsProps } from '~/models/resource/types';

import ValueGrid from '~/components/resource/value-grid';
import ResourceDebugger from '~/components/resource/resource-debugger';
import CompactResourceView from '~/components/views/compact-view/compact-resource-header';

export default function GenericDetails({
	resource,
	details,
}: ResourceDetailsProps) {
	return (
		<CompactResourceView resource={resource} showCover>
			<>
				<ValueGrid values={resource.values} />
				<ResourceDebugger
					resource={resource}
					details={details}
					className="mt-5"
				/>
			</>
		</CompactResourceView>
	);
}
