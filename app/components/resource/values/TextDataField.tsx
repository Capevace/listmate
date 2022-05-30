import type { TextData } from '~/models/resource/refs';
import DataLabel from '../DataLabel';
import type { BaseValueProps, FormatReturn } from './DataField';

export function format(value: TextData['value']): FormatReturn {
	return value ?? '-';
}

export default function TextDataField(props: BaseValueProps<TextData>) {
	return <DataLabel ref={props.data.ref}>{format(props.data.value)}</DataLabel>;
}
