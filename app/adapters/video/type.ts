import type {
	Resource,
	ResourceType,
	ValueRef,
	ValueType,
} from '~/models/resource/types';

export type VideoData = {
	title: ValueRef<ValueType.TEXT>;
	description: ValueRef<ValueType.TEXT> | null;
	publishedAt: ValueRef<ValueType.DATE>;
	channel: ValueRef<ValueType.RESOURCE> | null;
};

export type Video = Resource<ResourceType.VIDEO, VideoData>;
