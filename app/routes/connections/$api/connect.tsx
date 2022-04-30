import { redirect, LoaderFunction, json, ActionFunction } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { SourceType, stringToSourceType } from '~/models/resource/types';
import {
	createToken,
	deleteToken,
	findToken,
} from '~/models/source-token.server';
import { composeOauthUrl as composeSpotifyOauthUrl } from '~/apis/spotify.server';
import { composeOauthUrl as composeYouTubeOauthUrl } from '~/apis/youtube.server';

type LoaderData = {
	isConnected: boolean;
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');

	const sourceType = stringToSourceType(params.api);
	const token = await findToken(userId, sourceType);

	if (token && token.data) {
		return redirect('/connections');
	} else {
		if (token) {
			await deleteToken(userId, sourceType);
		}

		const newToken = await createToken(userId, sourceType);
		let url;

		switch (sourceType) {
			case SourceType.SPOTIFY:
				url = composeSpotifyOauthUrl(userId, newToken.id);
				break;
			case SourceType.YOUTUBE:
				url = composeYouTubeOauthUrl(userId, newToken.id);
				break;

			default:
				throw new Error(`Source ${sourceType} is not supported`);
		}

		return redirect(url);
	}

	return redirect('/connections');
};
