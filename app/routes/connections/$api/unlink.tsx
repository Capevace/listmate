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
} from '~/models/resource/resource.types';
import { findToken, invalidateToken } from '~/models/source-token.server';
import { requireUserId } from '~/session.server';
import { Modal, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router';

type LoaderData = {
	type: SourceType;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	invariant(params.api, 'No API found');

	const sourceType = stringToSourceType(params.api);

	return json<LoaderData>({
		type: sourceType,
	});
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.api, 'No API found');

	const sourceType = stringToSourceType(params.api);

	const token = await findToken(userId, sourceType);

	invariant(token && token.data, 'token should exist and be configured');

	await invalidateToken(userId, sourceType);

	return redirect('/connections');
};

export default function UnlinkPage() {
	const data = useLoaderData<LoaderData>();
	const navigate = useNavigate();

	return (
		<Modal
			opened={true}
			onClose={() => navigate(-1)}
			title={`Unlink ${data.type}`}
		>
			<p className="mb-4">Are you sure you want to unlink this connection?</p>

			<Group position="right">
				<Button variant="subtle" color="gray" onClick={() => navigate(-1)}>
					No, go back
				</Button>
				<Form method="post">
					<Button type="submit" variant="filled" color="red">
						Yes, unlink
					</Button>
				</Form>
			</Group>
		</Modal>
	);
}
