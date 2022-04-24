import type { ValueRef } from '~/models/resource/types';
import type { ResourceDetailsProps } from '../resource-details';

import capitalize from '~/utilities/capitalize';

import ResourceValueLabel from '~/components/common/resource-value-label';

export default function GenericDetails({ resource }: ResourceDetailsProps) {
	const valueList = Object.entries(resource.values);

	return (
		<dl className="grid grid-cols-6">
			{valueList.map(([key, value]: [string, ValueRef<string> | null]) => (
				<div key={key} className="col-span-2">
					<dt className="text-sm font-medium text-gray-400">
						{capitalize(key)}
					</dt>
					<dd className="mt-1 text-lg  sm:col-span-2 sm:mt-0">
						<ResourceValueLabel valueRef={value} />
					</dd>
				</div>
			))}
		</dl>
	);
}
