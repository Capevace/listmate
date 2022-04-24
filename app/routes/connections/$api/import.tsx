import {
	redirect,
	ActionFunction,
	LoaderFunction,
	json,
	useLoaderData,
} from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import ImportModal from '~/components/views/import-modal';
import { findToken } from '~/models/source-token.server';
import { SourceType, stringToSourceType } from '~/models/resource/types';
import {
	authorizeClient,
	createApi,
	importPlaylist,
} from '~/apis/spotify.server';

type LoaderData = {
	type: SourceType;
	playlists: SpotifyApi.PlaylistObjectSimplified[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');
	const sourceType = stringToSourceType(params.api);

	const token = await findToken(userId, sourceType);

	if (!token || !token.data) {
		return redirect(`/connections/${sourceType}`);
	}

	const api = await authorizeClient(createApi(), userId, token);

	const response = await api.getUserPlaylists();
	const playlists = response.body.items;

	return json<LoaderData>({
		type: sourceType,
		playlists: playlists,
	});
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');

	const formData = await request.formData();

	const sourceType = stringToSourceType(params.api);
	const token = await findToken(userId, sourceType);

	invariant(token && token.data, 'token should exist and be configured');

	const api = await authorizeClient(createApi(), userId, token);

	const playlistIds = formData.getAll('playlistIds[]');

	let lastPlaylist = null;
	for (const id of playlistIds) {
		lastPlaylist = await importPlaylist(api, userId, String(id));
		console.log('Imported playlist', lastPlaylist, id);
	}

	return redirect(lastPlaylist ? `/lists/${lastPlaylist.id}` : '/connections');
};

export default function ResourcesPage() {
	const { type, playlists } = useLoaderData<LoaderData>();

	return <ImportModal type={type} playlists={playlists} />;
}
