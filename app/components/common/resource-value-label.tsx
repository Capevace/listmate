import { Link } from 'remix';
import type { ValueRef } from '~/models/resource/types';

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
				className="hover:opacity-80"
			>
				{valueRef.value}
			</Link>
		) : (
			<>{valueRef.value}</>
		);
	}
}
