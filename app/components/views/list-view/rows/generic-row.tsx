import type { Resource } from '~/models/resource/types';
import ResourceValueLabel from '~/components/common/resource-value-label';
import FavouriteButton from '~/components/resource/favourite-button';
import composeCoverUrl from '~/utilities/cover-url';

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
			<figure className="col-span-1">
				{resource.thumbnail && (
					<img
						className="aspect-square w-8 rounded"
						alt={`${resource.title} thumbnail`}
						src={composeCoverUrl(resource) || ''}
						loading="lazy"
					/>
				)}
			</figure>
			<div className="col-span-10">
				<ResourceValueLabel
					valueRef={{ value: resource.title }}
					forceRef={resource.id}
				/>
			</div>
		</li>
	);
}
