import type { Album, ResourceDetailsProps } from '~/models/resource/types';
import type { AlbumDetails } from './adapter.server';

import ResourceHeader from '~/components/resource/resource-header';
import ValueGrid from '~/components/resource/value-grid';
import ListView from '~/components/views/list-view';
import ResourceDebugger from '~/components/resource/resource-debugger';

type AlbumDetailsProps = ResourceDetailsProps<Album, AlbumDetails>;

export default function AlbumDetailsView({
	resource,
	details,
}: AlbumDetailsProps) {
	return (
		<ListView
			items={details.songs}
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
