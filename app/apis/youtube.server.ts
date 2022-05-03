// youtube-api
// yt-dlp-wrap

import type { Video } from '~/adapters/video/type';
import {
	ApiAuthenticationParameters,
	ImportAPI,
	importImage,
	ImportParameters,
	importResourceData,
	ResourceImportParameters,
	ResourceSearchParameters,
	ResourceSearchResult,
	retryImport,
	ValidatedSourceURI,
} from './apis.server';
import makeProgress from '~/utilities/progress';
import { ResourceType, SourceType } from '~/models/resource/types';

import { youtube_v3, google, Auth } from 'googleapis';
import { updateTokenData } from '~/models/source-token.server';
import { User } from '~/models/user.server';
import invariant from 'tiny-invariant';
import { Channel } from '~/adapters/channel/type';
import { addSeconds } from '~/utilities/date';

export type API = ImportAPI<SourceType.YOUTUBE, YouTubeAPIType>;

export type YouTubeTokenData = {
	accessToken: string;
	refreshToken: string;
};

export type YouTubeAPIType = {
	auth: Auth.OAuth2Client;
	youtube: youtube_v3.Youtube;
};

/*
 * API & OAuth
 */
export function createApi(): API {
	const YouTubeAPI = google.youtube('v3');

	return {
		type: SourceType.YOUTUBE,
		authenticated: false,
		service: {
			auth: new google.auth.OAuth2(
				process.env.YOUTUBE_CLIENT_ID,
				process.env.YOUTUBE_CLIENT_SECRET,
				'http://localhost:3000/connections/youtube/oauth'
			), //google.auth.OAuth2,
			youtube: YouTubeAPI,
		},
	};
}

export async function authenticateApi(
	api: API,
	{ tokenData }: ApiAuthenticationParameters<YouTubeTokenData>
) {
	api.service.auth.setCredentials({
		access_token: tokenData.accessToken,
		refresh_token: tokenData.refreshToken,
	});
	api.authenticated = true;

	return api;
}

export function composeOauthUrl(_userId: User['id'], state: string) {
	const api = createApi();

	const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];

	return api.service.auth.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		state,
	});
}

export async function handleOauthCallback(userId: User['id'], code: string) {
	const api = createApi();
	const data = await api.service.auth.getToken(code);

	const accessToken = data.tokens.access_token;
	const refreshToken = data.tokens.refresh_token;
	const expiresAt = data.tokens.expiry_date
		? new Date(data.tokens.expiry_date)
		: addSeconds(new Date(), 3600);

	invariant(accessToken && refreshToken, 'Missing access token');

	const tokenData: YouTubeTokenData = {
		accessToken,
		refreshToken,
	};

	return updateTokenData(userId, SourceType.YOUTUBE, tokenData, expiresAt);
}

export function detectSourceType(uri: string): ValidatedSourceURI | null {
	if (uri.startsWith('youtube#video#')) {
		return {
			sourceType: SourceType.SPOTIFY,
			type: ResourceType.VIDEO,
			uri: uri.replace('youtube#video#', ''),
		};
	}

	return null;
}

/*
 * Import Resources
 */
export async function importResourceWithType({
	api,
	userId,
	uri,
	resourceType,
	progress = makeProgress(),
}: ResourceImportParameters<API>) {
	switch (resourceType) {
		case ResourceType.VIDEO:
			return importVideo(
				{ videoId: uri },
				{
					api,
					userId,
					progress,
				}
			);

		case ResourceType.CHANNEL:
			return importChannel(
				{ channelId: uri },
				{
					api,
					userId,
					progress,
				}
			);

		default:
			throw new Error(
				`Resource type ${resourceType} not supported by YouTube API`
			);
	}
}

export async function searchForResourceWithType({
	api,
	resourceType,
	search,
}: ResourceSearchParameters<API>): Promise<ResourceSearchResult[]> {
	switch (resourceType) {
		case ResourceType.VIDEO:
			return retryImport(() =>
				api.service.youtube.search
					.list({
						q: search,
						part: ['snippet'],
						auth: api.service.auth,
					})
					.then((res) => res.data.items ?? [])
					.then((items) =>
						items.filter(
							(item) => item.id?.kind === 'youtube#video' && item.id.videoId
						)
					)
					.then((items) =>
						items.map((item) => ({
							uri: item.id?.videoId ?? '',
							title: item.snippet?.title ?? 'No title returned',
							subtitle: item.snippet?.channelTitle ?? null,
							thumbnailUrl: item.snippet?.thumbnails?.default?.url ?? null,
						}))
					)
			);

		case ResourceType.CHANNEL:
			return retryImport(() =>
				api.service.youtube.search
					.list({
						q: search,
						part: ['snippet'],
						auth: api.service.auth,
					})
					.then((res) => res.data.items ?? [])
					.then((items) =>
						items.filter(
							(item) => item.id?.kind === 'youtube#channel' && item.id.channelId
						)
					)
					.then((items) =>
						items.map((item) => ({
							uri: item.id?.channelId ?? '',
							title: item.snippet?.title ?? 'No title returned',
							subtitle: null,
							thumbnailUrl: item.snippet?.thumbnails?.default?.url ?? null,
						}))
					)
			);

		default:
			throw new Error(
				`Resource type ${resourceType} not supported by YouTube API`
			);
	}
}

/*
 * Import implementations
 */

type VideoImportParameters = {
	videoId: string;
	channelData?: Channel;
};
export async function importVideo(
	{ videoId, channelData }: VideoImportParameters,
	{ api, userId, progress = makeProgress() }: ImportParameters<API>
) {
	const res = await retryImport(() =>
		api.service.youtube.videos.list({
			auth: api.service.auth,
			id: [videoId],
			part: ['snippet'],
		})
	);

	invariant(res.data.items && res.data.items.length > 0, 'Video not found');

	const videoData = res.data.items[0].snippet;

	invariant(videoData, 'Video not found');

	const data = {
		title: videoData.title,
		description: videoData.description ?? null,
		channelId: videoData.channelId,
		publishedAt: videoData.publishedAt,
	};

	invariant(
		data.title && data.channelId && data.publishedAt,
		'Returned video data invalid'
	);

	progress(0.4);

	const channel =
		channelData ??
		(await importChannel(
			{ channelId: data.channelId },
			{
				api,
				userId,
				progress: progress.sub(0.2),
			}
		));

	progress(0.6);

	const thumbnailReference =
		videoData.thumbnails?.maxres || videoData.thumbnails?.default;

	const thumbnail =
		thumbnailReference && thumbnailReference.url
			? await importImage(
					thumbnailReference.url,
					`youtube-thumbnail-${videoId}.jpg`
			  )
			: null;

	progress(0.8);

	const video = importResourceData<Video>(SourceType.YOUTUBE, videoId, {
		title: data.title,
		type: ResourceType.VIDEO,
		thumbnail: thumbnail,
		values: {
			title: { value: data.title },
			description: data.description ? { value: data.description } : null,
			publishedAt: { value: new Date(data.publishedAt) },
			channel: { value: channel.title, ref: channel.id },
		},
		remotes: {
			[SourceType.YOUTUBE]: videoId,
		},
	});

	progress(1.0);

	return video;
}

type ChannelImportParameters = {
	channelId: string;
};
export async function importChannel(
	{ channelId }: ChannelImportParameters,
	{ api, userId, progress = makeProgress() }: ImportParameters<API>
) {
	const res = await retryImport(() =>
		api.service.youtube.channels.list({
			id: [channelId],
			auth: api.service.auth,
			part: ['snippet'],
		})
	);

	invariant(res.data.items && res.data.items.length > 0, 'Channel not found');

	const channelData = res.data.items[0].snippet;

	invariant(channelData, 'Channel not found');

	const data = {
		title: channelData.title,
		publishedAt: channelData.publishedAt,
		description: channelData.description ?? null,
		url: channelData.customUrl ?? null,
	};

	invariant(data.title && data.publishedAt, 'Returned channel data invalid');

	progress(0.4);

	const thumbnailReference =
		channelData.thumbnails?.maxres || channelData.thumbnails?.default;

	const thumbnail =
		thumbnailReference && thumbnailReference.url
			? await importImage(
					thumbnailReference.url,
					`youtube-channel-thumbnail-${channelId}.jpg`
			  )
			: null;

	progress(0.7);

	const channel = importResourceData<Channel>(SourceType.YOUTUBE, channelId, {
		title: data.title,
		type: ResourceType.CHANNEL,
		thumbnail: thumbnail,
		values: {
			name: { value: data.title },
			createdAt: { value: new Date(data.publishedAt) },
			description: data.description ? { value: data.description } : null,
			url: data.url ? { value: data.url } : null,
		},
		remotes: {
			[SourceType.YOUTUBE]: channelId,
		},
	});

	progress(1.0);

	return channel;
}
