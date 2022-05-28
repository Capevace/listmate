import { Resource, ValueType } from '~/models/resource/types';
import ResourceValueLabel from '~/components/common/resource-value-label';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
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
			className="grid w-full grid-cols-12 items-center py-1 text-sm text-theme-200"
			style={style}
		>
			<InlineFavouriteButton resource={resource} className="col-span-1" />
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
					resource={resource}
					valueRef={{
						value: resource.title,
						type: ValueType.RESOURCE,
						ref: resource.id,
					}}
					forceRef={resource.id}
				/>
			</div>
		</li>
	);
}
