import { LoaderFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import type { ContextLoaderFunction } from '~/models/context';
import { requireUserId } from '~/session.server';
import { findToken } from '~/models/source-token.server';
import { handleOauthCallback as handleSpotifyOauthCallback } from '~/apis/spotify.server';
import { handleOauthCallback as handleYouTubeOauthCallback } from '~/apis/youtube.server';

import { SourceType, stringToSourceType } from '~/models/resource/types';

export const loader: LoaderFunction = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	const userId = await requireUserId(request, context);

	invariant(params.api, 'No API found');

	const sourceType = stringToSourceType(params.api);

	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	invariant(code, 'Expected OAuth code');

	const state = url.searchParams.get('state');
	invariant(state, 'Expected state ID for identification');

	const token = await findToken(userId, sourceType);
	invariant(token && token.id === state, 'Unauthorized request'); // no token was created, ever

	switch (sourceType) {
		case SourceType.SPOTIFY:
			await handleSpotifyOauthCallback(userId, code);
			break;
		case SourceType.YOUTUBE:
			await handleYouTubeOauthCallback(userId, code);
			break;

		default:
			throw new Error('Only Spotify is supported');
	}

	return redirect('/connections');
};
