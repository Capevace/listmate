// youtube-api
// yt-dlp-wrap

import type { Video } from '~/adapters/video/type';
import {
	ImportAPI,
	importImage,
	ImportParameters,
	importResource,
	retryImport,
} from './apis.server';
import makeProgress from '~/utilities/progress';
import { ResourceType, SourceType } from '~/models/resource/types';

import { youtube_v3, google, Auth } from 'googleapis';
import {
	findToken,
	SourceToken,
	updateTokenData,
} from '~/models/source-token.server';
import { User } from '~/models/user.server';
import invariant from 'tiny-invariant';
import { Channel } from '~/adapters/channel/type';
import { addSeconds } from '~/utilities/date';

type YouTubeAPIType = {
	auth: Auth.OAuth2Client;
	youtube: youtube_v3.Youtube;
};

export function createApi(): ImportAPI<YouTubeAPIType> {
	const YouTubeAPI = google.youtube('v3');

	return {
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

type YouTubeTokenData = {
	accessToken: string;
	refreshToken: string;
};

export function composeOauthUrl({
	userId,
	state,
}: {
	userId: User['id'];
	state: string;
}) {
	const api = createApi();

	const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];

	return api.service.auth.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		state,
	});
}

export async function handleOauthCallback({
	userId,
	code,
}: {
	userId: User['id'];
	code: string;
}) {
	const api = createApi();
	const data = await api.service.auth.getToken(code);
	console.log('youtube oauth data', data);

	const accessToken = data.tokens.access_token;
	const refreshToken = data.tokens.refresh_token;
	const expiresAt = data.tokens.expiry_date
		? new Date(data.tokens.expiry_date)
		: addSeconds(new Date(), 3600);

	invariant(accessToken && refreshToken, 'Missing access token');

	await updateAPITokens(userId, accessToken, refreshToken, expiresAt);
}

export function updateAPITokens(
	userId: User['id'],
	accessToken: string,
	refreshToken: string,
	expiresAt: Date
) {
	const data: YouTubeTokenData = { accessToken, refreshToken };

	return updateTokenData(userId, SourceType.YOUTUBE, data, expiresAt);
}

export async function authenticateApi(
	api: ImportAPI<YouTubeAPIType>,
	userId: User['id'],
	_token?: SourceToken
) {
	const token = _token ?? (await findToken(userId, SourceType.SPOTIFY));

	invariant(token && token.data, 'User is not connected to Spotify');

	const data: YouTubeTokenData = JSON.parse(token.data);

	api.service.auth.setCredentials({
		access_token: data.accessToken,
		refresh_token: data.refreshToken,
	});
	api.authenticated = true;

	return api;
}

type VideoImportParameters = ImportParameters<YouTubeAPIType> & {
	videoId: string;
};
export async function importVideo(
	{
		api,
		userId,
		progress = makeProgress(),

		videoId,
	}: VideoImportParameters,
	{ channelData }: { channelData?: Channel } = {}
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
		(await importChannel({
			api,
			userId,
			progress: progress.sub(0.2),
			channelId: data.channelId,
		}));

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

	console.log('video', videoData, data, channel);

	const video = importResource<Video>(SourceType.YOUTUBE, videoId, {
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

type ChannelImportParameters = ImportParameters<YouTubeAPIType> & {
	channelId: string;
};
export async function importChannel({
	api,
	userId,
	progress = makeProgress(),

	channelId,
}: ChannelImportParameters) {
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

	console.log('channel', channelData, data);

	const channel = importResource<Channel>(SourceType.YOUTUBE, channelId, {
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
