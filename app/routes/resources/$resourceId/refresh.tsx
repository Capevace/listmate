import { redirect, ActionFunction, json } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import {
	findResourceById,
	setFavouriteStatus,
} from '~/models/resource/resource.server';
import { SourceType, stringToSourceType } from '~/models/resource/types';
import { findToken } from '~/models/source-token.server';
import {
	authorizeClient,
	createApi,
	refreshResourceData,
} from '~/apis/spotify.server';

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.resourceId, 'resourceId not found');

	const url = new URL(request.url);
	const sourceTypeString = url.searchParams.get('source');

	// if (!sourceTypeString) {
	// 	throw new Response('A source type needs to be passed', { status: 400 });
	// }

	const sourceType = sourceTypeString
		? stringToSourceType(sourceTypeString)
		: SourceType.SPOTIFY; // TODO: choose default from resource itself

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		return new Response('Not Found', { status: 404 });
	}

	const token = await findToken(userId, sourceType);

	invariant(token && token.data, 'token should exist and be configured');

	const api = await authorizeClient(createApi(), userId, token);

	await refreshResourceData({ api, userId, resource });

	return redirect(`/resources/${resource.id}`);
};
