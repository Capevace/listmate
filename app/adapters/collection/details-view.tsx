import type {
	Collection,
	Resource,
	ResourceDetailsProps,
	ResourceType,
} from '~/models/resource/types';
import type { CollectionDetails } from './adapter.server';

import ResourceHeader from '~/components/resource/resource-header';
import ValueGrid from '~/components/resource/value-grid';
import ListView from '~/components/views/list-view';
import ResourceDebugger from '~/components/resource/resource-debugger';

export type CollectionDetailsProps<
	TResource extends Resource,
	TResourceType extends ResourceType
> = ResourceDetailsProps<
	Collection<TResource, TResourceType>,
	CollectionDetails<TResource>
> & {
	actions?: React.ReactNode;
};

export default function CollectionDetailsView<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>({
	resource,
	details,
	actions,
}: CollectionDetailsProps<TResource, TResourceType>) {
	return (
		<ListView
			items={details.items}
			header={
				<ResourceHeader resource={resource} actions={actions}>
					<ValueGrid values={resource.values} />
				</ResourceHeader>
			}
			headerHeight={365}
			footer={
				<ResourceDebugger
					resource={resource}
					details={details}
					className="mt-5"
				/>
			}
			footerHeight={100}
		/>
	);
}
