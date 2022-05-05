import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type NumberValueProps = {
	valueRef: ValueRef<ValueType.NUMBER>;
};

export default function NumberValue(props: NumberValueProps) {
	return <ValueLink valueRef={props.valueRef} />;
}
