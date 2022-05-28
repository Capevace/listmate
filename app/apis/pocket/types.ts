import type { Except } from 'type-fest';

export interface Config {
	consumerKey: string;
	redirectUri: string;
}

export type PocketResponse<DataType> = Except<Response, 'json'> & {
	data: DataType;
};

export interface RequestTokenData {
	consumer_key: string;
	code: string;
}

export interface AccessTokenData {
	access_token: string;
}

export type PocketTokenData = AccessTokenData;

export interface PocketAuthParameters {}

export interface RetrieveItemsRequest {
	state?: string;
	favorite?: '0' | '1';
	tag?: string | '_untagged_';
	contentType?: 'article' | 'video' | 'image';
	sort?: 'newest' | 'oldest' | 'title' | 'site';
	detailType?: 'complete' | 'simple';
	search?: string;
	domain?: string;
	since?: number;
	count?: number;
	offset?: number;
}

export type RawPocketMedia<MediaType extends 'video' | 'image' = 'image'> = {
	item_id: string;
	src: string;
	width: string;
	height: string;
} & (MediaType extends 'video'
	? {
			video_id: string;
			type: string;
			vid: string;
	  }
	: { image_id: string; credit?: string; caption?: string });

export type RawPocketVideo = RawPocketMedia<'video'>;
export type RawPocketImage = RawPocketMedia<'image'>;

export type RawPocketItem = {
	item_id: string;
	resolved_id: string;
	given_url: string; // 'http://www.grantland.com/blog/the-triangle/post/_/id/38347/ryder-cup-preview';
	given_title: string; // 'The Massive Ryder Cup Preview - The Triangle Blog - Grantland';
	favorite: '0' | '1'; // '0';
	status: '0' | '1' | '2'; // '0';
	resolved_title: string; // 'The Massive Ryder Cup Preview';
	resolved_url: string; // 'http://www.grantland.com/blog/the-triangle/post/_/id/38347/ryder-cup-preview';
	excerpt: string; // 'The list of things I love about the Ryder Cup is so long that it could fill a (tedious) novel, and golf fans can probably guess most of them.';
	is_article: '0' | '1'; // '1';
	has_video: '0' | '1'; // '1';
	has_image: '0' | '1'; // '1';
	word_count: string; // '3197';

	images: { [key: number]: RawPocketImage };
	videos: { [key: number]: RawPocketVideo };

	tags: any;
	authors: any;
};

export type RetrieveItemsData = {
	status: 0 | 1;
	list: {
		[key: number]: RawPocketItem;
	};
};

export type PocketItem = {
	id: string;
	url: string; // 'http://www.grantland.com/blog/the-triangle/post/_/id/38347/ryder-cup-preview';
	title: string; // 'The Massive Ryder Cup Preview - The Triangle Blog - Grantland';
	favorite: boolean;
	status: 'default' | 'archived' | 'deleted'; // '0';
	excerpt?: string;
	type: 'page' | 'article';
	hasVideo: boolean;
	hasImage: boolean;
	wordCount: number;

	images: PocketImage[];
	videos: PocketVideo[];
};

export type PocketMedia<MediaType extends 'video' | 'image' = 'image'> = {
	src: string;
	width: number;
	height: number;
} & (MediaType extends 'video'
	? {
			type: string;
			vid: string;
	  }
	: { credit?: string; caption?: string });

export type PocketVideo = PocketMedia<'video'>;
export type PocketImage = PocketMedia<'image'>;
