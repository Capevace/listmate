import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type URLValueProps = {
	valueRef: ValueRef<ValueType.URL>;
};

export default function URLValue({ valueRef }: URLValueProps) {
	return <ValueLink valueRef={valueRef}>{valueRef.value.toString()}</ValueLink>;
}
