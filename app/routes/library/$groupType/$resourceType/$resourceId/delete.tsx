import type { ContextLoaderFunction } from '~/models/context';
import { redirect } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import {
	deleteResource,
	findResourceById,
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
	const redirectTo = formData.get('redirectTo');

	await deleteResource(resource.id);

	return redirect(redirectTo ? redirectTo.toString() : '/');
};
