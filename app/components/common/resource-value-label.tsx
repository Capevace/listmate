import { Link } from 'remix';
import type { ValueRef } from '~/models/resource/base/resource';

export type ResourceValueLabelProps = {
	valueRef: ValueRef<string> | null;
	forceRef?: string;
};

export default function ResourceValueLabel({
	valueRef,
	forceRef,
}: ResourceValueLabelProps) {
	if (valueRef === null) {
		return <>-</>;
	} else {
		return forceRef || valueRef.ref ? (
			<Link
				to={`/resources/${forceRef || valueRef.ref}`}
				className="text-blue-500 hover:text-blue-700"
			>
				{valueRef.value}
			</Link>
		) : (
			<>{valueRef.value}</>
		);
	}
}
