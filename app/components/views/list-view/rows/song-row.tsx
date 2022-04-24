import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import type { Song } from '~/models/resource/types';

import { PlayIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';
import ResourceContextMenu from '~/components/common/resource-context-menu';
import FavouriteButton from '~/components/resource/favourite-button';

export default function SongRow({
	item,
	style,
}: {
	list: List;
	item: ListItemData<Song>;
	style: React.CSSProperties;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1  text-sm text-gray-200"
			style={style}
		>
			<div className="col-span-1 grid grid-cols-2 justify-start">
				<FavouriteButton resource={item.resource} className="col-span-1" />
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
