import type {
	Resource,
	ResourceType,
	ValueType,
	ValueRef,
} from '~/models/resource/types';

export type ChannelData = {
	name: ValueRef<ValueType.TEXT>;
	description: ValueRef<ValueType.TEXT> | null;
	url: ValueRef<ValueType.URL> | null;
	createdAt: ValueRef<ValueType.DATE> | null;
};

export type Channel = Resource<ResourceType.CHANNEL, ChannelData>;
