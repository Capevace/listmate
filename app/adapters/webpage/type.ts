import type {
	Resource,
	ValueRef,
	ResourceType,
	ValueType,
} from '~/models/resource/types';

export type WebpageData = {
	title: ValueRef<ValueType.TEXT>;
	description: ValueRef<ValueType.TEXT> | null;
	author: ValueRef<ValueType.TEXT> | null;
	url: ValueRef<ValueType.URL>;
};

export type Webpage = Resource<ResourceType.WEBPAGE, WebpageData>;
