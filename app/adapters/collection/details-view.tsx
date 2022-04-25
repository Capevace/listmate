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
>;

export default function CollectionDetailsView<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>({ resource, details }: CollectionDetailsProps<TResource, TResourceType>) {
	return (
		<ListView
			items={details.items}
			header={
				<ResourceHeader resource={resource}>
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
