import invariant from 'tiny-invariant';
import { CompleteDataObjectValue } from './adapters.server';
import {
	Resource,
	SerializedResource,
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
export function serialize<EValueType extends ValueType>(
	value: ValueTypeRawValue<EValueType>,
	type: EValueType
): string {
	const fn: (value: any) => string = SERIALIZERS[type];

	invariant(fn, `Unsupported value type: ${type}`);

	return fn(value);
}

/**
 * Serialize resource values to string for the DB.
 *
 * @param resource The resource to find additional details for
 */
export function serializeResource<TResource extends Resource>(
	resource: TResource
): SerializedResource<TResource> {
	let values: Record<string, SerializedValueRef | SerializedValueRef[] | null> =
		{};
	for (const [key, valueRef] of Object.entries(resource.values)) {
		if (Array.isArray(valueRef)) {
			values[key] = valueRef
				.map((childValueRef) => {
					return valueRef
						? ({
								...childValueRef,
								value: serialize(childValueRef.value, childValueRef.type),
						  } as SerializedValueRef)
						: null;
				})
				.filter(Boolean) as SerializedValueRef[];
		} else if (valueRef) {
			values[key] = {
				...valueRef,
				value: serialize(valueRef.value, valueRef.type),
			} as SerializedValueRef;
		} else {
			values[key] = null;
		}
	}

	return {
		...resource,
		values: values as SerializedValues<TResource['values']>,
	} as SerializedResource<TResource>;
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

	const deserializedValue = deserialize(value.value, type);
	return {
		value: deserializedValue,
		type,
		ref: value.valueDataObjectId ?? undefined,
	};
}

/**
 * Serialize resource values to string for the DB.
 *
 * @param resource The resource to find additional details for
 */
export function deserializeResource<TResource extends Resource>(
	serializedResource: SerializedResource<TResource>
): TResource {
	let values: Record<string, ValueRef | ValueRef[] | null> = {};

	for (const [key, serializedValueRef] of Object.entries(
		serializedResource.values
	)) {
		if (Array.isArray(serializedValueRef)) {
			values[key] = serializedValueRef.map(
				(childValueRef) =>
					({
						...childValueRef,
						value: deserialize(
							childValueRef.value,
							stringToValueType(childValueRef.type)
						),
					} as ValueRef)
			);
		} else if (serializedValueRef) {
			values[key] = {
				...serializedValueRef,
				value: deserialize(
					serializedValueRef.value,
					stringToValueType(serializedValueRef.type)
				),
			} as ValueRef;
		} else {
			values[key] = null;
		}
	}

	return {
		...serializedResource,
		values: values as TResource['values'],
	} as TResource;
}

export function deserialize<EValueType extends ValueType>(
	value: string,
	type: EValueType
): ValueTypeRawValue<EValueType> {
	const fn: (value: string) => any = DESERIALIZERS[type];

	invariant(fn, `deserialize: Unsupported value type: ${type}`);

	return fn(value);
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
