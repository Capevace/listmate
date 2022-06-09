import type {
	DataSchema,
	DateData,
	TextData,
	UrlData,
} from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type { Resource, ResourceType } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';

export type ChannelData = {
	name: TextData;
	description: TextData;
	url: UrlData;
	createdAt: DateData;
};

export const ChannelDataSchema: DataSchema<ChannelData> = {
	name: Schemas[ValueType.TEXT]().min(1), // title is required
	description: Schemas[ValueType.TEXT]().optional(),
	url: Schemas[ValueType.URL]().optional(),
	createdAt: Schemas[ValueType.DATE]().optional(),
};

export type Channel = Resource<ResourceType.CHANNEL, ChannelData>;
