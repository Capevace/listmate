import type { NumberData } from '~/models/resource/refs';
import type { BaseValueProps, FormatReturn } from './DataField';
import DataLabel from '../DataLabel';

export function format(value: NumberData['value']): FormatReturn {
	return value?.toString() ?? '-';
}

export default function NumberDataField({ data }: BaseValueProps<NumberData>) {
	return <DataLabel ref={data.ref}>{format(data.value)}</DataLabel>;
}
