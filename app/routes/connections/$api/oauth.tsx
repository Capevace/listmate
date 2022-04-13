import { LoaderFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import { SourceType } from '~/models/resource/resource.types';
import { findToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';
import { createApi, updateAPITokens } from '~/apis/spotify.server';

/**
 * Function to add seconds to date
 */
function addSeconds(date: Date, seconds: number) {
	return new Date(date.getTime() + seconds * 1000);
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	invariant(code, 'Expected OAuth code');

	const state = url.searchParams.get('state');
	invariant(state, 'Expected state ID for identification');

	const token = await findToken(userId, SourceType.SPOTIFY);
	invariant(token && token.id === state, 'Unauthorized request'); // no token was created, ever

	const spotifyApi = createApi();

	const data = await spotifyApi.authorizationCodeGrant(code);
	const expiresAt = addSeconds(new Date(), data.body.expires_in);
	const accessToken = data.body.access_token;
	const refreshToken = data.body.refresh_token;

	await updateAPITokens(userId, accessToken, refreshToken, expiresAt);

	return redirect('/connections/spotify');
};
