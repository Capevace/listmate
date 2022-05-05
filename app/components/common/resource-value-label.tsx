import { Link } from 'remix';
import type { Resource, ValueRef } from '~/models/resource/types';
import {
	composeResourceUrl,
	composeShortResourceUrl,
} from '~/utilities/resource-url';

export type ResourceValueLabelProps = {
	resource?: Resource | null;
	valueRef: ValueRef | null;
	forceRef?: string;
};

export default function ResourceValueLabel({
	resource,
	valueRef,
	forceRef,
}: ResourceValueLabelProps) {
	const ref = forceRef ?? valueRef?.ref;

	if (valueRef === null) {
		return <>-</>;
	} else {
		return ref ? (
			<Link
				to={composeShortResourceUrl(ref)}
				className="truncate hover:opacity-80"
			>
				{valueRef.value}
			</Link>
		) : (
			<>{valueRef.value}</>
		);
	}
}
