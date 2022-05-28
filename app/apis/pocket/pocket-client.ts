/**
 * This client is based on https://github.com/yeukfei02/node-pocket-api.
 */

import invariant from 'tiny-invariant';
import type {
	Config,
	AccessTokenData,
	RetrieveItemsRequest,
	PocketResponse,
	RequestTokenData,
	RetrieveItemsData,
	RawPocketItem,
	PocketItem,
} from './types';

const ROOT_URL = 'https://getpocket.com/v3';

async function pocketFetch<DataType>(
	url: string,
	data: any,
	method: 'GET' | 'POST' = 'POST'
): Promise<PocketResponse<DataType>> {
	const response = await fetch(`${ROOT_URL}/${url}`, {
		body: JSON.stringify(data),
		method,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'X-Accept': 'application/json',
		},
	});

	const json = await response.json();

	return { ...response, data: json };
}

export function getAuthorizeUrl(
	requestToken: string,
	redirectUri: string
): string {
	return `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`;
}

export async function getRequestToken(
	consumerKey: string,
	redirectUri: string
) {
	const response = await pocketFetch<RequestTokenData>('oauth/request', {
		consumer_key: consumerKey,
		redirect_uri: redirectUri,
	});

	if (response && response.data) {
		return response.data.code;
	}

	throw new Error('Request token could not be obtained.');
}

export async function getAccessToken(consumerKey: string, code: string) {
	const response = await pocketFetch<AccessTokenData>('oauth/request', {
		consumer_key: consumerKey,
		code,
	});

	invariant(
		response && response.data && response.data.access_token,
		'Access token could not be obtained.'
	);

	return response.data.access_token;
}

export async function fetchItems(
	consumerKey: string,
	accessToken: string,
	data: RetrieveItemsRequest = {}
): Promise<PocketItem[]> {
	const response = await pocketFetch<RetrieveItemsData>(`${ROOT_URL}/get`, {
		...data,
		consumer_key: consumerKey,
		access_token: accessToken,
	});

	invariant(
		response && response.data && response.data.list,
		'Could not retrieve items.'
	);

	return Object.values(response.data.list).map((item: RawPocketItem) => ({
		id: item.item_id,
		url: item.given_url,
		title: item.resolved_title,
		favorite: item.favorite === '1',
		status:
			item.status === '1'
				? 'archived'
				: item.status === '2'
				? 'deleted'
				: 'default',
		excerpt: item.excerpt,
		type: item.is_article === '1' ? 'article' : 'page',
		hasVideo: item.has_video === '1',
		hasImage: item.has_image === '1',
		wordCount: parseInt(item.word_count),

		images: Object.values(item.images).map((image) => ({
			...image,
			width: parseInt(image.width),
			height: parseInt(image.height),
		})),
		videos: Object.values(item.videos).map((video) => ({
			...video,
			width: parseInt(video.width),
			height: parseInt(video.height),
		})),
	}));
}
