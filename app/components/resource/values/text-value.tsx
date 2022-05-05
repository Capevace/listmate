import { ValueRef, ValueType } from '~/models/resource/types';
import ValueLink from './value-link';

export type TextValueProps = {
	valueRef: ValueRef<ValueType.TEXT>;
};

export default function TextValue(props: TextValueProps) {
	return <ValueLink valueRef={props.valueRef} />;
}
