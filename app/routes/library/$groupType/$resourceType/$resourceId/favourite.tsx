import type { ContextLoaderFunction } from '~/models/context';
import { redirect, json } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import {
	findResourceById,
	setFavouriteStatus,
} from '~/models/resource/resource.server';

export const action = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'resourceId not found');

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		return new Response('Not Found', { status: 404 });
	}

	const formData = await request.formData();
	const isFavourite = formData.get('isFavourite');
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
