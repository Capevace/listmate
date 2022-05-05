import type { Resource, ValueRef } from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';
import ResourceValueLabel from '~/components/common/resource-value-label';

export default function ValueGrid({ values }: { values: Resource['values'] }) {
	const valueList = Object.entries(values) as [[string, ValueRef | null]];

	return (
		<dl className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
			{valueList.map(([key, value]: [string, ValueRef | null]) => (
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
