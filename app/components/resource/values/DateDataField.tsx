import type { DateData } from '~/models/resource/refs';
import DataLabel from '../DataLabel';
import type { BaseValueProps, FormatReturn } from './DataField';

export function format(value: DateData['value']): FormatReturn {
	return value?.toLocaleString() ?? '-';
}

export default function DateDataField({ data }: BaseValueProps<DateData>) {
	return <DataLabel ref={data.ref}>{format(data.value)}</DataLabel>;
}
