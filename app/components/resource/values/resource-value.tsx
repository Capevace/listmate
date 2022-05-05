import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type ResourceValueProps = {
	valueRef: ValueRef<ValueType.RESOURCE>;
};

export default function ResourceValue({ valueRef }: ResourceValueProps) {
	return <ValueLink valueRef={valueRef}>{valueRef.value}</ValueLink>;
}
