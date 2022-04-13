import { useState } from 'react';
import { Form, useNavigate } from 'remix';
import { SourceType } from '~/models/resource/resource.types';
import capitalize from '~/utilities/capitalize';
import {
	Button,
	Group,
	Modal,
	TransferList,
	TransferListData,
	TransferListItem,
} from '@mantine/core';

export type ImportModalProps = {
	type: SourceType;
	playlists: SpotifyApi.PlaylistObjectSimplified[];
};

export default function ImportModal({ type, playlists }: ImportModalProps) {
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
