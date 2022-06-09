import { Except, ValueOf } from 'type-fest';
import * as zod from 'zod';
import { SerializationMode, SourceType, ValueType } from './types';

export type RefWithOptionalKey = { id: string; key?: string };
export type RefWithRequiredKey = { id: string; key: string };

// The data types defined here are used in adapter types to defined their models.
// @see {SongData}
// @see {SongDataSchema}

type Data<
	Type,
	TypeOfValue,
	RefType,
	ESerializationMode extends SerializationMode
> = {
	type: ESerializationMode extends SerializationMode.SERIALIZED ? string : Type;
	value: ESerializationMode extends SerializationMode.SERIALIZED
		? string | null
		: TypeOfValue | null;
	ref: RefType | null;
};

/**
 * Value data type for text values.
 */
export type TextData<
	ESerializationMode extends SerializationMode = SerializationMode.DESERIALIZED
> = Data<ValueType.TEXT, string, RefWithOptionalKey, ESerializationMode>;

/**
 * Value data type for numeric values.
 */
export type NumberData<
	ESerializationMode extends SerializationMode = SerializationMode.DESERIALIZED
> = Data<ValueType.NUMBER, number, RefWithRequiredKey, ESerializationMode>;

/**
 * Value data type for date values.
 */
export type DateData<
	ESerializationMode extends SerializationMode = SerializationMode.DESERIALIZED
> = Data<ValueType.DATE, Date, RefWithRequiredKey, ESerializationMode>;
/**
 * Value data type for URL values.
 */
export type UrlData<
	ESerializationMode extends SerializationMode = SerializationMode.DESERIALIZED
> = Data<ValueType.URL, URL, RefWithRequiredKey, ESerializationMode>;

/**
 * Value data type for SourceType values.
 */
export type SourceTypeData<
	ESerializationMode extends SerializationMode = SerializationMode.DESERIALIZED
> = Data<
	ValueType.SOURCE_TYPE,
	SourceType,
	RefWithRequiredKey,
	ESerializationMode
>;

/**
 * Value data type for resource lists.
 */
export type ListData<
	serialization extends SerializationMode = SerializationMode.DESERIALIZED
> = {
	type: serialization extends SerializationMode.SERIALIZED
		? string
		: ValueType.LIST;
	items: StrictValueData<serialization>[];
	ref: RefWithRequiredKey | null;
};

/**
 * StrictValueData is any data type, that includes a value property.
 *
 * This property can be null, but has to be "present" in objects.
 * Every type except for RESOURCE_LIST is included in this.
 */
export type StrictValueData<
	S extends SerializationMode = SerializationMode.DESERIALIZED
> = TextData<S> | NumberData<S> | DateData<S> | UrlData<S> | SourceTypeData<S>;

/**
 * Represents data with a given mode (required / optional).
 */
export type DataWithMode<S extends SerializationMode> =
	| StrictValueData<S>
	| ListData<S>;

/**
 * Any data with either required or optional value.
 */
export type AnyData<
	S extends SerializationMode = SerializationMode.DESERIALIZED
> = DataWithMode<SerializationMode.DESERIALIZED>;

/**
 * Any data with either required or optional value.
 */
export type AnySerializedData = DataWithMode<SerializationMode.SERIALIZED>;
// | RequiredData<SerializationMode.SERIALIZED>;

/**
 * The Zod schemas for available ValueTypes.
 *
 * Used by adapter types for schema creation and for validation.
 */
export const Schemas = {
	[ValueType.TEXT]: () => zod.string(),
	[ValueType.NUMBER]: () => zod.number(),
	[ValueType.DATE]: () => zod.date(),
	[ValueType.URL]: () => zod.string().url(),
	[ValueType.SOURCE_TYPE]: () => zod.nativeEnum(SourceType),
	[ValueType.LIST]: () =>
		zod.array(zod.object({ id: zod.string(), title: zod.string() })),
};

/**
 * Type for adapters to implement when exporting their zod schema.
 */
export type DataSchema<DataKeys> = {
	[key in keyof DataKeys]: zod.ZodSchema;
};
