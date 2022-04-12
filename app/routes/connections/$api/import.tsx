import {
	redirect,
	ActionFunction,
	LoaderFunction,
	json,
	useLoaderData,
	Form,
} from 'remix';
import invariant from 'tiny-invariant';
import {
	SourceType,
	stringToSourceType,
} from '~/models/resource/base/resource';
import { findToken, invalidateToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';
import { Modal, Button, Group, TransferListItem } from '@mantine/core';
import { useNavigate } from 'react-router';
import capitalize from '~/utilities/capitalize';
import {
	authorizeClient,
	createApi,
	importPlaylist,
} from '~/sync/spotify.server';
import { TransferList, TransferListData } from '@mantine/core';

import { SpotifyPlaylist } from '~/sync/types';
import { useState } from 'react';

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

	for (const id of playlistIds) {
		const playlist = await importPlaylist(api, userId, String(id));
		console.log(playlist, id);
	}

	return redirect('/connections');
};

export default function ResourcesPage() {
	const { type, playlists } = useLoaderData<LoaderData>();
	const navigate = useNavigate();
	const [userPlaylists, setUserPlaylists] = useState(
		playlists.map((playlist) => ({
			label: playlist.name,
			value: playlist.id,
		})) as TransferListItem[]
	);
	const [selectedPlaylists, setSelectedPlaylists] = useState(
		[] as TransferListItem[]
	);

	const updatePlaylists = (data: TransferListData) => {
		// const set = new Set<string>(items.map((item) => item.value));

		// setSelectedPlaylists(
		// 	items.filter((item) => {
		// 		const shouldKeep = set.has(item.value);

		// 		if (shouldKeep) set.delete(item.value);

		// 		return shouldKeep;
		// 	})
		// );

		setUserPlaylists(data[0]);
		setSelectedPlaylists(data[1]);
	};

	return (
		<Modal
			opened={true}
			onClose={() => navigate(-1)}
			title={`${capitalize(type)} Resources`}
			size="100%"
			classNames={{
				modal: 'w-full max-w-2xl',
			}}
		>
			<pre>{JSON.stringify(selectedPlaylists, null, 2)}</pre>
			<TransferList
				value={[userPlaylists, selectedPlaylists]}
				searchPlaceholder="Search..."
				nothingFound="Nothing here"
				titles={[`${capitalize(type)} Playlists`, 'Playlists to Import']}
				breakpoint="sm"
				onChange={updatePlaylists}
				className="mb-5"
			/>

			<Group position="right">
				<Button variant="subtle" color="gray" onClick={() => navigate(-1)}>
					Close
				</Button>

				<Form method="post">
					{selectedPlaylists.map((playlist) => (
						<input
							type="hidden"
							name="playlistIds[]"
							value={playlist.value}
							key={playlist.value}
						/>
					))}

					<Button type="submit" variant="filled">
						Import playlists
					</Button>
				</Form>
			</Group>
		</Modal>
	);
}
