import { redirect, LoaderFunction, json } from 'remix';
import invariant from 'tiny-invariant';
import {
	SourceType,
	stringToSourceType,
} from '~/models/resource/base/resource';
import { createToken, findToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';
import { authorizeClient, createApi } from '~/sync/spotify';

type LoaderData = {
	isConnected: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');

	const sourceType = stringToSourceType(params.api);

	switch (sourceType) {
		case SourceType.SPOTIFY:
			let api = createApi();
			const token = await findToken(userId, sourceType);

			if (!token || !token.data) {
				const newToken = await createToken(userId, sourceType);

				const scopes = [
					'playlist-read-private',
					'playlist-read-collaborative',
					'user-library-read',
				];
				const state = newToken.id;

				return redirect(api.createAuthorizeURL(scopes, state));
			}
			api = await authorizeClient(api, userId, token);

			return json<LoaderData>({
				isConnected: true,
			});

		default:
			throw new Error('Only Spotify is supported');
	}
};

export default function APILoaderPage() {
	return <div>You are connected to this API.</div>;
}
