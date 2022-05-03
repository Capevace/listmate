import { Link } from 'remix';
import type { Resource, ValueRef } from '~/models/resource/types';
import {
	composeResourceUrl,
	composeShortResourceUrl,
} from '~/utilities/resource-url';

export type ResourceValueLabelProps = {
	resource?: Resource | null;
	valueRef: ValueRef<string> | null;
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
				to={
					resource ? composeResourceUrl(resource) : composeShortResourceUrl(ref)
				}
				className="hover:opacity-80"
			>
				{valueRef.value}
			</Link>
		) : (
			<>{valueRef.value}</>
		);
	}
}
