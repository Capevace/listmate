import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';

export default function GenericRow({
	list,
	item,
}: {
	list: List;
	item: ListItemData;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1 px-5 text-sm text-gray-200"
		>
			<div className="col-span-11">{item.resource.title}</div>
		</li>
	);
}
