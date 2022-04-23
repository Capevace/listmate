import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import type { Song } from '~/models/resource/resource.types';

import { HeartIcon, PlayIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';
import { Form, useLocation, useTransition } from 'remix';
import { useState } from 'react';
import ResourceContextMenu from '../resource-context-menu';

export default function SongRow({
	item,
	style,
}: {
	list: List;
	item: ListItemData<Song>;
	style: React.CSSProperties;
}) {
	const location = useLocation();

	const transition = useTransition();

	// TODO: this enables Optimistic UI, however if the heart is clicked really fast
	const isFavourite = transition.submission?.action.includes(item.resource.id)
		? !item.resource.isFavourite
		: item.resource.isFavourite;

	const [isFavouriteState, setIsFavouriteState] = useState(isFavourite);

	// useEffect(() => {
	//

	// 	setIsFavouriteState(isFavourite);
	// }, [
	// 	transition.submission?.action,
	// 	item.resource.id,
	// 	item.resource.isFavourite,
	// ]);

	const heartClass = isFavouriteState
		? 'text-red-500   stroke-2 hover:stroke-red-500 active:stroke-0 opacity-30'
		: 'text-gray-600  stroke-2 hover:stroke-gray-600  active:stroke-0 opacity-30 ';

	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1  text-sm text-gray-200"
			style={style}
		>
			<div className="col-span-1 grid grid-cols-2 justify-start">
				<Form
					replace
					method="post"
					action={`/resources/${item.resource.id}/favourite`}
					onSubmit={(e) => {
						setIsFavouriteState(!isFavouriteState);
					}}
				>
					<input
						type="hidden"
						name="isFavourite"
						value={String(!isFavouriteState)}
					/>
					<input type="hidden" name="redirectTo" value={location.pathname} />
					<button className={`${heartClass} group col-span-1`} type="submit">
						<HeartIcon className="w-6 " />
					</button>
				</Form>
				<button className="col-span-1 text-gray-700 hover:text-gray-400">
					<PlayIcon className="w-6 " />
				</button>
			</div>
			<div className="col-span-5 truncate">
				<ResourceValueLabel
					valueRef={item.resource.values.name}
					forceRef={item.resource.id}
				/>
			</div>
			<div className="col-span-3 truncate">
				<ResourceValueLabel valueRef={item.resource.values.artist} />
			</div>
			<div className="col-span-2 truncate">
				<ResourceValueLabel valueRef={item.resource.values.album} />
			</div>
			<div className="col-span-1 flex justify-end">
				<ResourceContextMenu />
			</div>
		</li>
	);
}
