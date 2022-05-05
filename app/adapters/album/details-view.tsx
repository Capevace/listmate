import type { Album, ResourceDetailsProps } from '~/models/resource/types';
import type { AlbumDetails } from './adapter.server';

import invariant from 'tiny-invariant';
import GenericListView from '~/components/views/generic-list-view';
import CompactResourceView from '~/components/views/compact-view/compact-resource-header';
import { useRef } from 'react';
import BaseRow from '~/components/views/rows/base-row';

type AlbumDetailsProps = ResourceDetailsProps<Album, AlbumDetails>;

export default function AlbumDetailsView({
	resource,
	details,
}: AlbumDetailsProps) {
	const ref = useRef<HTMLElement>(null);

	return (
		<CompactResourceView parentRef={ref} resource={resource} showCover>
			<GenericListView
				size={details.songs.length}
				estimateHeight={() => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const item = details.songs[index];

					return (
						<BaseRow
							key={`${item.id}-${index}`}
							measureRef={row.measureRef}
							resource={item}
							style={
								row
									? {
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: `${row.size}px`,
											transform: `translateY(${row.start}px)`,
									  }
									: { position: 'relative' }
							}
						/>
					);
				}}
			</GenericListView>
		</CompactResourceView>
		// <ListView
		// 	items={details.songs}
		// 	header={
		// 		<ResourceHeader resource={resource}>
		// 			<ValueGrid values={resource.values} />
		// 		</ResourceHeader>
		// 	}
		// 	headerHeight={365}
		// 	footer={
		// 		<ResourceDebugger
		// 			resource={resource}
		// 			details={details}
		// 			className="mt-5"
		// 		/>
		// 	}
		// 	footerHeight={100}
		// />
	);
}
