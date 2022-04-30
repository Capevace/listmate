import { usePlayer } from '~/components/player/use-player';
import Header from '~/components/views/header';
import GenericListView from '~/components/views/generic-list-view';
import BaseRow from '~/components/views/list-view/rows/base-row';

export default function QueueView() {
	const [playerState] = usePlayer();

	const items = [
		...(playerState?.queue ?? []).map((song) => song.resource),
		'separator',
		...(playerState?.context?.queue ?? []).map((song) => song.resource),
	];

	return (
		<GenericListView size={items.length} estimateHeight={(index) => 55}>
			{(index, row) => {
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
