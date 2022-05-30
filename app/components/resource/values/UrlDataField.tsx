import type { UrlData } from '~/models/resource/refs';
import type { BaseValueProps, FormatReturn } from './DataField';

export function format(value: UrlData['value']): FormatReturn {
	return value?.toString() ?? '-';
}

export default function UrlDataField({ data }: BaseValueProps<UrlData>) {
	if (!data.value) {
		return <>-</>;
	} else {
		return data.ref ? (
			<a
				href={data.value.toString()}
				target="_blank"
				className="truncate hover:opacity-80"
				rel="noreferrer"
			>
				{format(data.value)}
			</a>
		) : (
			<>{format(data.value)}</>
		);
	}
}
