import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import type { Song } from '~/models/resource/resource.types';

import { DotsHorizontalIcon, PlayIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';

export default function SongRow({
	list,
	item,
}: {
	list: List;
	item: ListItemData<Song>;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1  text-sm text-gray-200"
		>
			<div className="col-span-1 flex justify-start">
				<button className="text-gray-700 hover:text-gray-400 ">
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
				<button className="text-gray-700 hover:text-gray-400 ">
					<DotsHorizontalIcon className="w-6 " />
				</button>
			</div>
		</li>
	);
}
