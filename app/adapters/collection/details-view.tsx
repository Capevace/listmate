import {
	Collection,
	Resource,
	ResourceDetailsProps,
	ResourceType,
	SourceType,
	SOURCE_ICONS,
} from '~/models/resource/types';
import type { CollectionDetails } from './adapter.server';

import ResourceHeader from '~/components/resource/resource-header';
import ValueGrid from '~/components/resource/value-grid';
import GenericListView from '~/components/views/generic-list-view';
import ResourceDebugger from '~/components/resource/resource-debugger';
import { useRef } from 'react';
import CompactView from '~/components/views/compact-view/compact-view';
import invariant from 'tiny-invariant';
import BaseRow from '~/components/views/list-view/rows/base-row';
import composeCoverUrl from '~/utilities/cover-url';
import capitalize from '~/utilities/capitalize';
import { Link } from 'remix';
import SpotifyIcon from '~/components/icons/spotify-icon';
import { Download, Spotify } from 'react-bootstrap-icons';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import CompactResourceView from '~/components/views/compact-view/compact-resource-header';

export type CollectionDetailsProps<
	TResource extends Resource,
	TResourceType extends ResourceType
> = ResourceDetailsProps<
	Collection<TResource, TResourceType>,
	CollectionDetails<TResource>
> & {
	actions?: JSX.Element;
};

export default function CollectionDetailsView<
	TResource extends Resource = Resource,
	TResourceType extends ResourceType = ResourceType.COLLECTION
>({
	resource,
	details,
	actions,
}: CollectionDetailsProps<TResource, TResourceType>) {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<CompactResourceView
			parentRef={ref}
			resource={resource}
			actions={actions}
			showCover
		>
			<GenericListView
				size={details.items.length}
				estimateHeight={() => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const item = details.items[index];

					return (
						<BaseRow
							key={`${item.id}-${index}`}
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
