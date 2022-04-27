import type { Resource, RawValue, ResourceType } from '~/models/resource/types';

export type ChannelData = {
	name: RawValue<string>;
	description: RawValue<string> | null;
	url: RawValue<string> | null;
	createdAt: RawValue<Date> | null;
};

export type Channel = Resource<ResourceType.CHANNEL, ChannelData>;
