import { Link } from 'remix';
import { ValueRef } from '~/models/resource/types';
import { composeShortResourceUrl } from '~/utilities/resource-url';

export type ValueLinkProps = {
	valueRef: ValueRef | null;
	children?: React.ReactNode;
};

export default function ValueLink({ valueRef, children }: ValueLinkProps) {
	if (valueRef === null) {
		return <></>;
	}

	return valueRef?.ref ? (
		<Link
			to={composeShortResourceUrl(valueRef.ref)}
			className="truncate hover:opacity-80"
		>
			{children ?? valueRef.value}
		</Link>
	) : (
		<>{children ?? valueRef.value}</>
	);
}
