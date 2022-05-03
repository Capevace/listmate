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
import {
	ResourceType,
	SourceType,
	stringToSourceType,
} from '~/models/resource/types';
import { authenticateApi, createApi } from '~/apis/spotify.server';
import { importResourceWithType } from '~/apis/apis.server';
import { composeResourceUrl } from '~/utilities/resource-url';

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

	const api = await authenticateApi(createApi(), {
		userId,
		tokenData: JSON.parse(token.data),
		tokenExpiresAt: token.expiresAt,
	});

	const response = await api.service.getUserPlaylists();
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

	const api = await authenticateApi(createApi(), {
		userId,
		tokenData: JSON.parse(token.data),
		tokenExpiresAt: token.expiresAt,
	});

	const playlistIds = formData.getAll('playlistIds[]');

	let lastPlaylist = null;
	for (const id of playlistIds) {
		lastPlaylist = await importResourceWithType({
			api,
			userId,
			sourceType,
			resourceType: ResourceType.PLAYLIST,
			uri: String(id),
		});
	}

	return redirect(
		lastPlaylist ? composeResourceUrl(lastPlaylist) : '/connections'
	);
};

export default function ResourcesPage() {
	const { type, playlists } = useLoaderData<LoaderData>();

	return <ImportModal type={type} playlists={playlists} />;
}
