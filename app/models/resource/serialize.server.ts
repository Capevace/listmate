import invariant from 'tiny-invariant';
import { CompleteDataObjectValue } from './adapters.server';
import {
	Resource,
	SerializedValueRef,
	SerializedValues,
	SourceType,
	stringToSourceType,
	stringToValueType,
	ValueRef,
	ValueType,
	ValueTypeRawValue,
} from './types';

/**
 * Serialize resource values to string for the DB.
 *
 * @param resource The resource to find additional details for
 */
export function serializeValue(valueRef: ValueRef<ValueType>): string {
	const fn: (value: any) => string = SERIALIZERS[valueRef.type];

	invariant(fn, `Unsupported value type: ${valueRef.type}`);

	return fn(valueRef.value);
}

const SERIALIZERS: {
	[key in ValueType]: (value: ValueTypeRawValue<key>) => string;
} = {
	[ValueType.TEXT]: (value: string) => value,
	[ValueType.NUMBER]: (value: number) => value.toString(),
	[ValueType.DATE]: (value: Date) => value.toISOString(),
	[ValueType.URL]: (value: URL) => value.toJSON(),
	[ValueType.SOURCE_TYPE]: (value: SourceType) => value.toString(),
	[ValueType.RESOURCE]: (value: Resource['title']) => value,
	[ValueType.RESOURCE_LIST]: (value: Resource['title']) => value,
};

/**
 * Serialize resource values to string for the DB.
 *
 * @param resource The resource to find additional details for
 */
export function deserializeValue(
	value: CompleteDataObjectValue
): ValueRef | ValueRef[] {
	const type = stringToValueType(value.type);

	if (type === ValueType.RESOURCE_LIST) {
		return value.items.map((item) => {
			return {
				ref: item.valueDataObjectId,
				value: item.value,
				type: ValueType.RESOURCE,
			} as ValueRef<ValueType.RESOURCE>;
		});
	}

	const fn: (value: string) => any = DESERIALIZERS[type];
	const deserializedValue = fn ? fn(value.value) : null;
	return {
		value: deserializedValue,
		type,
		ref: value.valueDataObjectId ?? undefined,
	};
}

const DESERIALIZERS: {
	[key in ValueType]: (value: string) => ValueTypeRawValue<key>;
} = {
	[ValueType.TEXT]: (value) => value,
	[ValueType.NUMBER]: (value) => parseInt(value),
	[ValueType.DATE]: (value) => new Date(value),
	[ValueType.URL]: (value) => new URL(value),
	[ValueType.SOURCE_TYPE]: (value) => stringToSourceType(value),
	[ValueType.RESOURCE]: (value) => value,
	[ValueType.RESOURCE_LIST]: (value) => value,
};
