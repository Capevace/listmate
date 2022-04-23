import ResourceValueLabel from '~/components/common/resource-value-label';
import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';

export default function GenericRow({
	list,
	item,
	style,
}: {
	list: List;
	item: ListItemData;
	style: React.CSSProperties;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1 px-5 text-sm text-gray-200"
			style={style}
		>
			<div className="col-span-12">
				<ResourceValueLabel
					valueRef={{ value: item.resource.title }}
					forceRef={item.resource.id}
				/>
			</div>
		</li>
	);
}
