import type { SourceTypeData } from '~/models/resource/refs';
import type { BaseValueProps, FormatReturn } from './DataField';
import DataLabel from '../DataLabel';
import { SOURCE_NAMES } from '~/models/resource/types';

export function format(value: SourceTypeData['value']): FormatReturn {
	return value ? SOURCE_NAMES[value] : '-';
}

export default function SourceTypeValue({
	data,
}: BaseValueProps<SourceTypeData>) {
	return <DataLabel ref={data.ref}>{format(data.value)}</DataLabel>;
}
