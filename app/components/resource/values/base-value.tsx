import React from 'react';
import { deserialize } from '~/models/resource/serialize';
import { ValueRef, ValueType } from '~/models/resource/types';
import DateValue from './date-value';
import NumberValue from './number-value';
import ResourceListValue from './resource-list-value';
import ResourceValue from './resource-value';
import SourceTypeValue from './source-type-value';
import TextValue from './text-value';
import URLValue from './url-value';

const VALUE_COMPONENTS: {
	[key in ValueType]: (valueRef: ValueRef) => React.ReactNode;
} = {
	[ValueType.TEXT]: (valueRef) => (
		<TextValue valueRef={valueRef as ValueRef<ValueType.TEXT>} />
	),
	[ValueType.NUMBER]: (valueRef) => (
		<NumberValue valueRef={valueRef as ValueRef<ValueType.NUMBER>} />
	),
	[ValueType.DATE]: (valueRef) => (
		<DateValue valueRef={valueRef as ValueRef<ValueType.DATE>} />
	),
	[ValueType.URL]: (valueRef) => (
		<URLValue valueRef={valueRef as ValueRef<ValueType.URL>} />
	),
	[ValueType.SOURCE_TYPE]: (valueRef) => (
		<SourceTypeValue valueRef={valueRef as ValueRef<ValueType.SOURCE_TYPE>} />
	),
	[ValueType.RESOURCE]: (valueRef) => (
		<ResourceValue valueRef={valueRef as ValueRef<ValueType.RESOURCE>} />
	),
	[ValueType.RESOURCE_LIST]: (valueRef) => (
		<ResourceListValue valueRef={valueRef as ValueRef<ValueType.RESOURCE>} />
	),
};

export type BaseValueProps = {
	valueRef: ValueRef;
};

export default function BaseValue(props: BaseValueProps) {
	return <>{VALUE_COMPONENTS[props.valueRef.type](props.valueRef)}</>;
}
