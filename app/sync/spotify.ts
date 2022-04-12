import SpotifyWebApi from 'spotify-web-api-node';
import invariant from 'tiny-invariant';
import { SourceType } from '~/models/resource/base/resource';
import {
	findToken,
	SourceToken,
	updateTokenData,
} from '~/models/source-token.server';
import { User } from '~/models/user.server';

type SpotifyTokenData = {
	accessToken: string;
	refreshToken: string;
};

export function createApi() {
	return new SpotifyWebApi({
		redirectUri: 'http://localhost:3000/connections/spotify/oauth',
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_SECRET,
	});
}

export async function authorizeClient(
	api: SpotifyWebApi,
	userId: User['id'],
	_token?: SourceToken
) {
	const token = _token || (await findToken(userId, SourceType.SPOTIFY));

	invariant(token && token.data, 'User is not connected to Spotify');

	const data: SpotifyTokenData = JSON.parse(token.data);

	api.setAccessToken(data.accessToken);
	api.setRefreshToken(data.refreshToken);

	return api;
}

export function updateAPITokens(
	userId: User['id'],
	accessToken: string,
	refreshToken: string,
	expiresAt: Date
) {
	const data: SpotifyTokenData = { accessToken, refreshToken };

	return updateTokenData(userId, SourceType.SPOTIFY, data, expiresAt);
}
