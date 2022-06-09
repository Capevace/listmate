import { datacatalog_v1 } from 'googleapis';
import invariant from 'tiny-invariant';
import { ValueOf } from 'type-fest';
import * as zod from 'zod';
import { Channel, ChannelDataSchema } from '~/adapters/channel/type';
import { Video, VideoDataSchema } from '~/adapters/video/type';
import { CompleteDataObjectValue } from './adapters.server';
import {
	AnyData,
	AnySerializedData,
	DataSchema,
	ListData,
	Schemas,
} from './refs';
import {
	Album,
	AlbumData,
	AlbumDataSchema,
	Artist,
	ArtistData,
	ArtistDataSchema,
	Collection,
	CollectionDataSchema,
	Playlist,
	PlaylistDataSchema,
	Resource,
	ResourceType,
	SerializedResource,
	SerializedValueRef,
	SerializedValues,
	Song,
	SongDataSchema,
	SourceType,
	stringToResourceType,
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
	[ValueType.LIST]: (value: Resource['title']) => value,
};

function deserializeResource<TSerializedResource extends SerializedResource>(
	resource: TSerializedResource
): Resource<TSerializedResource['type']> {
	const values: [keyof TSerializedResource['values'], AnySerializedData][] =
		Object.entries(resource.values);

	const resourceType = stringToResourceType(resource.type);

	return {
		...resource,
		values: values.reduce((_values, [key, data]) => {
			const resourceSchema =
				ResourceSchemas[ResourceType.ALBUM ?? resourceType];
			const schema = resourceSchema[key];

			_values[key] = deserializeData<key>(data, schema);
			return _values;
		}, {} as { [key in keyof TSerializedResource['values']]: AnyData }),
	};
}

export type ResourceTypes<T extends ResourceType> = T extends ResourceType.ALBUM
	? Album
	: T extends ResourceType.ARTIST
	? Artist
	: T extends ResourceType.CHANNEL
	? Channel
	: T extends ResourceType.COLLECTION
	? Collection
	: T extends ResourceType.PLAYLIST
	? Playlist
	: T extends ResourceType.SONG
	? Song
	: T extends ResourceType.VIDEO
	? Video
	: never;

export type DataTypes<
	Key extends keyof ResourceTypes<T>['values'],
	T extends ResourceType
> = ResourceTypes<T>['values'][Key];

export type ExtractSchemaType<V extends SchemaTypes<ResourceType>> =
	V extends SchemaTypes<infer T> ? T : never;

export type SchemaTypes<T extends ResourceType> = T extends ResourceType.ALBUM
	? typeof AlbumDataSchema
	: T extends ResourceType.ARTIST
	? typeof ArtistDataSchema
	: T extends ResourceType.CHANNEL
	? typeof ChannelDataSchema
	: T extends ResourceType.COLLECTION
	? typeof CollectionDataSchema
	: T extends ResourceType.PLAYLIST
	? typeof PlaylistDataSchema
	: T extends ResourceType.SONG
	? typeof SongDataSchema
	: T extends ResourceType.VIDEO
	? typeof VideoDataSchema
	: never;

export const ResourceSchemas: {
	[key in ResourceType]: SchemaTypes<key>;
} = {
	[ResourceType.ALBUM]: AlbumDataSchema,
	[ResourceType.ARTIST]: ArtistDataSchema,
	[ResourceType.CHANNEL]: ChannelDataSchema,
	[ResourceType.COLLECTION]: CollectionDataSchema,
	[ResourceType.PLAYLIST]: PlaylistDataSchema,
	[ResourceType.SONG]: SongDataSchema,
	[ResourceType.VIDEO]: VideoDataSchema,
};

const dataSchemaFactory = (
	subschema: zod.ZodSchema,
	key: 'value' | 'items' = 'value'
) =>
	zod.union([
		zod.object({
			type: zod.nativeEnum(ValueType),
			value: subschema,
			ref: zod
				.object({
					id: zod.string().uuid(),
					key: zod.string().optional(),
				})
				.nullable(),
		}),
		zod.object({
			type: zod.string().regex(/^list$/),
			items: subschema,
			ref: zod
				.object({
					id: zod.string().uuid(),
					key: zod.string().optional(),
				})
				.nullable(),
		}),
	]);

function deserializeData<
	TKey extends keyof ResourceTypes<TResourceType>['values'],
	TResourceType extends ResourceType
>(
	data: AnySerializedData,
	schema: SchemaTypes<TResourceType>[TKey]
): ResourceTypes<TResourceType>['values'][TKey] {
	const mainSchema = dataSchemaFactory(schema);
	const parsedData = mainSchema.parse(data);

	invariant(
		!data.ref || (data.ref && data.ref.id),
		'Invalid ref, ID is required'
	);

	if (parsedData.type === ValueType.LIST) {
		const listData = parsedData as ListData;

		invariant(listData.items, 'Items are required');
		invariant(
			!listData.ref || (listData.ref && listData.ref.key),
			'Ref in lists need keys'
		);

		return {
			type: listData.type,
			ref: listData.ref
				? {
						id: listData.ref.id,
						key: String(listData.ref.key),
				  }
				: null,
			items: listData.items,
		};
	} else {
		return {
			type: parsedData.type,
			ref: parsedData.ref
				? {
						id: parsedData.ref.id,
						key: parsedData.ref.key ? String(parsedData.ref.key) : undefined,
				  }
				: null,
			value: parsedData,
		};
	}
}

/**
 * Serialize resource values to string for the DB.
 *
 * @param resource The resource to find additional details for
 */
export function deserializeValue(value: CompleteDataObjectValue): AnyData {
	const type = stringToValueType(value.type);

	// if (type === ValueType.LIST) {
	// 	return value.items.map((item) => {
	// 		return {
	// 			ref: item.valueDataObjectId,
	// 			value: item.value,
	// 			type: ValueType.RESOURCE,
	// 		} as ValueRef<ValueType.RESOURCE>;
	// 	});
	// }

	return {
		value: value.value ? deserialize(value.value, type) : null,
		type,
		ref: value.valueDataObjectId ? { id: value.valueDataObjectId } : null,
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
	[ValueType.LIST]: (value) => value,
};
