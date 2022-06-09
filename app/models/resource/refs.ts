import { ValueType } from './types';

export type RefWithOptionalKey = { id: string; key?: string };
export type RefWithRequiredKey<T extends string = string> =
	RefWithOptionalKey & {
		key: T;
	};

// The data types defined here are used in adapter types to defined their models.
// @see {SongData}
// @see {SongDataSchema}

export type Data<
	T = any,
	TValueType extends ValueType = ValueType,
	RefType extends RefWithOptionalKey = RefWithOptionalKey
> = {
	type: TValueType;
	value: T;
	ref: RefType | null;
};

/**
 * Value data type for resource lists.
 */
export type ListData<T = any> = {
	type: ValueType.LIST;
	items: Data<T>[];
	ref: RefWithRequiredKey | null;
};

export type AnyData = Data<any> | ListData<any>;

// /**
//  * The Zod schemas for available ValueTypes.
//  *
//  * Used by adapter types for schema creation and for validation.
//  */
// export const Schemas = {
// 	[ValueType.TEXT]: () => zod.string(),
// 	[ValueType.NUMBER]: () => zod.number(),
// 	[ValueType.DATE]: () => zod.date(),
// 	[ValueType.URL]: () => zod.string().url(),
// 	[ValueType.SOURCE_TYPE]: () => zod.nativeEnum(SourceType),
// 	[ValueType.LIST]: () =>
// 		zod.array(zod.object({ id: zod.string(), title: zod.string() })),
// };

// /**
//  * Type for adapters to implement when exporting their zod schema.
//  */
// export type DataSchema<DataKeys> = {
// 	[key in keyof DataKeys]: zod.ZodSchema;
// };
