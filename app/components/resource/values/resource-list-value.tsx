import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type ResourceListValueProps = {
	valueRef: ValueRef<ValueType.RESOURCE>;
};

export default function ResourceListValue({
	valueRef,
}: ResourceListValueProps) {
	return <ValueLink valueRef={valueRef}>{valueRef.value}</ValueLink>;
}
