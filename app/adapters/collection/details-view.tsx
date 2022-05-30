import { useRef } from 'react';
import invariant from 'tiny-invariant';
import CompactResourceView from '~/components/views/compact-view/compact-resource-header';
import GenericListView from '~/components/views/generic-list-view';
import ResourceRow from '~/components/views/rows/ResourceRow';
import type {
	CollectionDetails,
	Resource,
	ResourceDetails,
	ResourceDetailsProps,
} from '~/models/resource/types';

export type CollectionDetailsProps<
	TResource extends Resource,
	TDetails extends ResourceDetails
> = ResourceDetailsProps<TResource, TDetails> & {
	actions?: JSX.Element;
};

export default function CollectionDetailsView<
	TResource extends Resource = Resource,
	TDetails extends CollectionDetails = CollectionDetails
>({ resource, details, actions }: CollectionDetailsProps<TResource, TDetails>) {
	const ref = useRef<HTMLDivElement>(null);
	const items = details.items;

	return (
		<CompactResourceView
			parentRef={ref}
			resource={resource}
			actions={actions}
			showCover
		>
			<GenericListView
				size={items.length}
				estimateHeight={() => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const item = items[index];

					return (
						<ResourceRow
							key={`${item}-${index}`}
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
	);
}
