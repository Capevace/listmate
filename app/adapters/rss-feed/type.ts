import type {
	ResourceType,
	CollectionData,
	Webpage,
	Collection,
} from '~/models/resource/types';

export type RSSFeedData = CollectionData<Webpage> & {};

export type RSSFeed = Collection<Webpage, ResourceType.RSS_FEED> & {};
