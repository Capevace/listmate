import React from 'react';
import type {
	AnyData,
	DateData,
	ListData,
	NumberData,
	SourceTypeData,
	TextData,
	UrlData,
} from '~/models/resource/refs';
import { ValueType } from '~/models/resource/types';
import DateDataField from './DateDataField';
import NumberValue from './NumberDataField';
import SourceTypeDataField from './SourceTypeDataField';
import TextDataField from './TextDataField';
import UrlDataField from './UrlDataField';
import ListDataField from './ListDataField';

const VALUE_COMPONENTS: {
	[key in ValueType]: (data: AnyData) => React.ReactNode;
} = {
	[ValueType.TEXT]: (data) => <TextDataField data={data as TextData} />,
	[ValueType.NUMBER]: (data) => <NumberValue data={data as NumberData} />,
	[ValueType.DATE]: (data) => <DateDataField data={data as DateData} />,
	[ValueType.URL]: (data) => <UrlDataField data={data as UrlData} />,
	[ValueType.SOURCE_TYPE]: (data) => (
		<SourceTypeDataField data={data as SourceTypeData} />
	),
	[ValueType.LIST]: (data) => <ListDataField data={data as ListData} />,
};

export type BaseValueProps<T extends AnyData = AnyData> = {
	data: T;
};

export type FormatReturn = string | null;

export default function DataField(props: BaseValueProps) {
	return <>{VALUE_COMPONENTS[props.data.type](props.data)}</>;
}
