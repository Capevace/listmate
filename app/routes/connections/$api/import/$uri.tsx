import { json, LoaderFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import { authenticateApi, createApi, importVideo } from '~/apis/youtube.server';
import { SourceType, stringToSourceType } from '~/models/resource/types';
import { findToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');
	const sourceType = stringToSourceType(params.api);

	const uri = params.uri;

	if (!uri) {
		throw new Response('No URI found', { status: 400 });
	}

	const token = await findToken(userId, sourceType);

	if (!token || !token.data) {
		return redirect(`/connections`);
	}

	switch (sourceType) {
		case SourceType.YOUTUBE:
			const api = await authenticateApi(createApi(), userId, token);
			const video = await importVideo({ api, userId, videoId: uri });

			return json({
				video,
			});
		default:
			throw new Response(`Source ${sourceType} is not supported yet`, {
				status: 400,
			});
	}
};
