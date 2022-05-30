/* eslint-disable array-callback-return */
import type { ListData } from '~/models/resource/refs';
import { ValueType } from '~/models/resource/types';
import DataLabel from '../DataLabel';
import type { BaseValueProps } from './DataField';
import { format as formatDate } from './DateDataField';
import { format as formatNumber } from './NumberDataField';
import { format as formatSourceType } from './SourceTypeDataField';
import { format as formatText } from './TextDataField';
import { format as formatUrl } from './UrlDataField';

export default function ListDataField(props: BaseValueProps<ListData>) {
	return (
		<DataLabel ref={props.data.ref}>
			<>
				{props.data.items
					.map((item) => {
						switch (item.type) {
							case ValueType.TEXT:
								return formatText(item.value);
							case ValueType.NUMBER:
								return formatNumber(item.value);
							case ValueType.DATE:
								return formatDate(item.value);
							case ValueType.URL:
								return formatUrl(item.value);
							case ValueType.SOURCE_TYPE:
								return formatSourceType(item.value);
						}
					})
					.join(', ')}
			</>
		</DataLabel>
	);
}
