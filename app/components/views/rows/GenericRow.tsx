import { Resource } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import composeCoverUrl from '~/utilities/cover-url';
import { BaseRowProps } from './ResourceRow';
import DataField from '~/components/resource/values/DataField';

export default function GenericRow({
	resource,
	style,
}: BaseRowProps<Resource>) {
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
				<DataField
					data={{
						value: resource.title,
						type: ValueType.TEXT,
						ref: {
							id: resource.id,
						},
					}}
				/>
			</div>
		</li>
	);
}
