import type { DataSchema, DateData, TextData } from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type { Resource, ResourceType } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';

export type VideoData = {
	title: TextData;
	description: TextData;
	publishedAt: DateData;
	channel: TextData;
};

export const VideoDataSchema: DataSchema<VideoData> = {
	title: Schemas[ValueType.TEXT]().min(1), // title is required
	description: Schemas[ValueType.TEXT]().optional(),
	publishedAt: Schemas[ValueType.DATE]().optional(),
	channel: Schemas[ValueType.TEXT]().optional(),
};

export type Video = Resource<ResourceType.VIDEO, VideoData>;
