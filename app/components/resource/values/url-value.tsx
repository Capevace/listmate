import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type URLValueProps = {
	valueRef: ValueRef<ValueType.URL>;
};

export default function URLValue({ valueRef }: URLValueProps) {
	return (
		<a
			href={valueRef.value.toString()}
			target="_blank"
			className="truncate hover:opacity-80"
			rel="noreferrer"
		>
			{valueRef.value.toString()}
		</a>
	);
}
