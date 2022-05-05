import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type DateValueProps = {
	valueRef: ValueRef<ValueType.DATE>;
};

export default function DateValue({ valueRef }: DateValueProps) {
	return (
		<ValueLink valueRef={valueRef}>{valueRef.value.toLocaleString()}</ValueLink>
	);
}
