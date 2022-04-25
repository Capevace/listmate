import { ActionFunction } from 'remix';
import invariant from 'tiny-invariant';
import {
	authorizeClient,
	createApi,
	importPlaylist,
} from '~/apis/spotify.server';
import { getList } from '~/models/list.server';
import { SourceType, stringToSourceType } from '~/models/resource/types';
import { findToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.listId, 'listId is required');

	const list = await getList({ id: params.listId });

	if (!list) {
		throw new Response('List not found', { status: 404 });
	}

	const sourceType = SourceType.SPOTIFY; //stringToSourceType(params.api);
	const token = await findToken(userId, sourceType);

	invariant(token && token.data, 'token should exist and be configured');

	const api = await authorizeClient(createApi(), userId, token);

	// await importPlaylist({
	// 	api,
	// 	userId,
	// 	playlistId: list.,
	// });

	// return redirect(lastPlaylist ? `/lists/${lastPlaylist.id}` : '/connections');
};
