import { Link } from 'remix';
import type { AnyRef } from '~/models/resource/refs';
import { composeShortResourceUrl } from '~/utilities/resource-url';

export type DataLabelProps = {
	children?: string | JSX.Element | JSX.Element[] | null;
	ref?: AnyRef | null;
};
export default function DataLabel({ children, ref }: DataLabelProps) {
	if (!children) {
		return <>-</>;
	} else {
		return ref ? (
			<Link
				to={composeShortResourceUrl(ref.id)}
				className="truncate hover:opacity-80"
			>
				{children}
			</Link>
		) : (
			<>{children}</>
		);
	}
}
