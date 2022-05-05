import { SOURCE_NAMES, ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type SourceTypeValueProps = {
	valueRef: ValueRef<ValueType.SOURCE_TYPE>;
};

export default function SourceTypeValue({ valueRef }: SourceTypeValueProps) {
	return (
		<ValueLink valueRef={valueRef}>{SOURCE_NAMES[valueRef.value]}</ValueLink>
	);
}
