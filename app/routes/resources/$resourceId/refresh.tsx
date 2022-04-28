import { redirect, ActionFunction } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourceById } from '~/models/resource/resource.server';
import {
	sourceTypeToName,
	stringToSourceTypeOptional,
} from '~/models/resource/types';
import {
	composeAuthenticatedApi,
	importResourceWithType,
} from '~/apis/apis.server';

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.resourceId, 'resourceId not found');

	const url = new URL(request.url);
	const form = await request.formData();

	const sourceType = stringToSourceTypeOptional(
		url.searchParams.get('source') ?? form.get('source')?.toString()
	);

	if (!sourceType) {
		throw new Response('API not found', { status: 404 });
	}

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Resource not found', { status: 404 });
	}

	const api = await composeAuthenticatedApi(userId, sourceType);

	if (!api) {
		throw new Response(
			`User is not logged in to ${sourceTypeToName(sourceType)} API`,
			{ status: 401 }
		);
		// return redirect(`/connections/${sourceType}`);
	}

	const uri = resource.remotes[sourceType];

	if (!uri) {
		throw new Response(
			`Resource is not connected to ${sourceTypeToName(sourceType)} API`,
			{ status: 400 }
		);
		// return redirect(`/connections/${sourceType}`);
	}

	resource = await importResourceWithType({
		api,
		userId,
		sourceType,
		resourceType: resource.type,
		uri,
	});

	return redirect(`/resources/${resource.id}`);
};
