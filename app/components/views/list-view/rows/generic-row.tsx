import type { Resource } from '~/models/resource/types';
import ResourceValueLabel from '~/components/common/resource-value-label';
import FavouriteButton from '~/components/resource/favourite-button';

export default function GenericRow({
	resource,
	style,
}: {
	resource: Resource;
	style: React.CSSProperties;
}) {
	return (
		<li
			className="grid w-full grid-cols-12 items-center py-1 text-sm text-gray-200"
			style={style}
		>
			<FavouriteButton resource={resource} className="col-span-1" />
			<div className="col-span-11">
				<ResourceValueLabel
					valueRef={{ value: resource.title }}
					forceRef={resource.id}
				/>
			</div>
		</li>
	);
}
