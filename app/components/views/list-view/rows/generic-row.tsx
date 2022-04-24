import ResourceValueLabel from '~/components/common/resource-value-label';
import FavouriteButton from '~/components/resource/favourite-button';
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
			className="grid w-full grid-cols-12 items-center py-1 text-sm text-gray-200"
			style={style}
		>
			<FavouriteButton resource={item.resource} className="col-span-1" />
			<div className="col-span-11">
				<ResourceValueLabel
					valueRef={{ value: item.resource.title }}
					forceRef={item.resource.id}
				/>
			</div>
		</li>
	);
}
