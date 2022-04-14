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
	SourceType,
	stringToSourceType,
} from '~/models/resource/resource.types';
import {
	authorizeClient,
	createApi,
	importPlaylist,
} from '~/apis/spotify.server';
import {
	findResourceById,
	setFavouriteStatus,
} from '~/models/resource/resource.server';

export const action: ActionFunction = async ({ request, params }) => {
	await requireUserId(request);

	invariant(params.resourceId, 'resourceId not found');

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		return new Response('Not Found', { status: 404 });
	}

	const formData = await request.formData();
	const isFavourite = formData.get('favourite');
	const redirectTo = formData.get('redirectTo');

	invariant(isFavourite, 'You need to specify favourite status');

	resource = await setFavouriteStatus(resource.id, isFavourite === 'true');

	if (redirectTo) {
		return redirect(redirectTo.toString());
	}
	return json({
		resource,
	});
};
