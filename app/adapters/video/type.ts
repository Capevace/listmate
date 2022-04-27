import type {
	Resource,
	RawValue,
	ForceResourceType,
	ResourceType,
	ValueRef,
} from '~/models/resource/types';
import { Channel } from '~/adapters/channel/type';

export type VideoData = {
	title: RawValue<string>;
	description: RawValue<string> | null;
	publishedAt: RawValue<Date>;
	channel: ValueRef<string, Channel> | null;
};

export type Video = Resource<ResourceType.VIDEO, VideoData>;
