import { usePlayer } from '~/components/player/use-player';
import Header from '~/components/views/header';
import GenericListView from '~/components/views/generic-list-view';
import BaseRow from '~/components/views/list-view/rows/base-row';
import invariant from 'tiny-invariant';
import composePageTitle from '~/utilities/page-title';
import { MetaFunction } from 'remix';

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

	const estimateHeight = (index: number) => {
		return index === 0 ? 114 : 50;
	};

	return (
		<GenericListView
			size={items.length}
			estimateHeight={estimateHeight}
			header={
				<Header
					className="mx-auto max-w-7xl"
					title="Player Queue"
					subtitle={
						playerState?.context
							? `Playing ${playerState.context.resource.title}`
							: ''
					}
				/>
			}
		>
			{(index, row) => {
				invariant(row, 'Only JS-enabled supported for now');

				const item = items[index];

				if (typeof item === 'string') {
					return (
						<div
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
							className="flex items-center justify-center"
						>
							<hr className="w-full border-4 border-gray-700" />
						</div>
					);
				}

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
	);
}
