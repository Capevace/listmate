import { SourceType, ValueType } from './types';
import * as zod from 'zod';

type RefWithOptionalKey = { id: string; key?: string };
type RefWithRequiredKey = { id: string; key: string };

export type Ref =
	| {
			type: ValueType.TEXT;
			value: string | null;
			ref: RefWithOptionalKey | null;
	  }
	| {
			type: ValueType.NUMBER;
			value: number | null;
			ref: RefWithRequiredKey | null;
	  }
	| {
			type: ValueType.DATE;
			value: Date | null;
			ref: RefWithRequiredKey | null;
	  }
	| {
			type: ValueType.URL;
			value: URL | null;
			ref: RefWithRequiredKey | null;
	  }
	| {
			type: ValueType.SOURCE_TYPE;
			value: SourceType;
			ref: RefWithRequiredKey | null;
	  }
	| {
			type: ValueType.RESOURCE_LIST;
			items: { id: string; title: string }[];
			ref: RefWithRequiredKey | null;
	  };

const Schemas = {
	[ValueType.TEXT]: zod.string(),
	[ValueType.NUMBER]: zod.number(),
	[ValueType.DATE]: zod.date(),
	[ValueType.URL]: zod.string().url(),
	[ValueType.SOURCE_TYPE]: zod.nativeEnum(SourceType),
	[ValueType.RESOURCE_LIST]: zod.array(
		zod.object({ id: zod.string(), title: zod.string() })
	),
};

function composeRefSchema(
	valueSchema: zod.ZodSchema<any>,
	key: 'value' | 'items' = 'value'
): zod.ZodSchema {
	return zod.object({
		type: zod.nativeEnum(ValueType),
		[key]: valueSchema.nullable(),
		ref: zod
			.object({
				id: zod.string(),
				key: zod.string(),
			})
			.nullable(),
	});
}
