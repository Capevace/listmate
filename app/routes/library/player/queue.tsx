import { usePlayer } from '~/components/player/use-player';
import GenericListView from '~/components/views/generic-list-view';
import invariant from 'tiny-invariant';
import composePageTitle from '~/utilities/page-title';
import { MetaFunction } from 'remix';
import CompactView from '~/components/views/compact-view/compact-view';
import { useRef } from 'react';
import ResourceRow from '~/components/views/rows/ResourceRow';

export const meta: MetaFunction = () => {
	return {
		title: composePageTitle('Queue'),
	};
};

export default function QueueView() {
	const [playerState] = usePlayer();

	const items = [
		...(playerState?.queue ?? []).map((song) => song.resource),
		'separator',
		...(playerState?.context?.queue ?? []).map((song) => song.resource),
	];

	const ref = useRef<HTMLElement>(null);

	return (
		<CompactView
			parentRef={ref}
			title={'Search results'}
			subtitle={playerState?.queue ? `${playerState.queue.length} items` : ''}
		>
			<GenericListView
				size={items.length}
				estimateHeight={() => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const resource = items[index];

					if (typeof resource === 'string') {
						return <div className="separator" />;
					}

					return (
						<ResourceRow
							key={`${resource.id}-${index}`}
							measureRef={row.measureRef}
							resource={resource}
							style={
								row
									? {
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											transform: `translateY(${row.start}px)`,
									  }
									: { position: 'relative' }
							}
						/>
					);
				}}
			</GenericListView>
		</CompactView>
	);
}
