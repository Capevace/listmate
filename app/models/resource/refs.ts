import { Except, ValueOf } from 'type-fest';
import * as zod from 'zod';
import { SerializationMode, SourceType, ValueType } from './types';

export type RefWithOptionalKey = { id: string; key?: string };
export type RefWithRequiredKey = { id: string; key: string };

// The data types defined here are used in adapter types to defined their models.
// @see {SongData}
// @see {SongDataSchema}

/**
 * Value data type for text values.
 */
export type TextData = {
	type: ValueType.TEXT;
	value: string | null;
	ref: RefWithOptionalKey | null;
};

/**
 * Value data type for numeric values.
 */
export type NumberData = {
	type: ValueType.NUMBER;
	value: number | null;
	ref: RefWithRequiredKey | null;
};

/**
 * Value data type for date values.
 */
export type DateData = {
	type: ValueType.DATE;
	value: Date | null;
	ref: RefWithRequiredKey | null;
};

/**
 * Value data type for URL values.
 */
export type UrlData = {
	type: ValueType.URL;
	value: URL | null;
	ref: RefWithRequiredKey | null;
};

/**
 * Value data type for SourceType values.
 */
export type SourceTypeData = {
	type: ValueType.SOURCE_TYPE;
	value: SourceType | null;
	ref: RefWithRequiredKey | null;
};

/**
 * Value data type for resource lists.
 */
export type ListData<
	serialization extends SerializationMode = SerializationMode.DESERIALIZED
> = {
	type: ValueType.LIST;
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
	serialization extends SerializationMode = SerializationMode.DESERIALIZED
> = serialization extends SerializationMode.DESERIALIZED
	? TextData | NumberData | DateData | UrlData | SourceTypeData
	: {
			type: string;
			value: string | null;
			ref: RefWithOptionalKey | null;
	  };

/**
 * Represents data with a given mode (required / optional).
 */
export type DataWithMode<serialization extends SerializationMode> =
	| StrictValueData<serialization>
	| ListData<serialization>;

/**
 * Any data with either required or optional value.
 */
export type AnyData = DataWithMode<SerializationMode.DESERIALIZED>;

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
