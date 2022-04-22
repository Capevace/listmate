import { useState } from 'react';
import { Form, useNavigate, useTransition } from 'remix';
import { SourceType } from '~/models/resource/resource.types';
import capitalize from '~/utilities/capitalize';
import {
	Button,
	Group,
	LoadingOverlay,
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
	const transition = useTransition();
	const isLoading = transition.state !== 'idle';

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
			onClose={() => (!isLoading ? navigate(-1) : null)}
			title={`${capitalize(type)} Resources`}
			size="100%"
			classNames={{
				modal: 'w-full max-w-2xl relative',
			}}
		>
			<LoadingOverlay visible={isLoading} />

			<TransferList
				value={[userPlaylists, selectedPlaylists]}
				searchPlaceholder="Search..."
				nothingFound="Nothing here"
				titles={[`${capitalize(type)} Playlists`, 'Playlists to Import']}
				breakpoint="sm"
				onChange={updatePlaylists}
				className="mb-5"
				aria-disabled={true}
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

					<Button type="submit" variant="filled" loading={isLoading}>
						Import playlists
					</Button>
				</Form>
			</Group>
		</Modal>
	);
}
