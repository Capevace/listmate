import { json, LoaderFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import {
	composeAuthenticatedApi,
	importResourceWithType,
} from '~/apis/apis.server';
import {
	stringToResourceTypeOptional,
	stringToSourceTypeOptional,
} from '~/models/resource/types';
import { requireUserId } from '~/session.server';
import capitalize from '~/utilities/capitalize';
import { composeResourceUrl } from '~/utilities/resource-url';

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	const sourceType = stringToSourceTypeOptional(params.api);

	if (!sourceType) {
		throw new Response('API not found', { status: 404 });
	}

	const resourceType = stringToResourceTypeOptional(params.resourceType);

	if (!resourceType) {
		throw new Response('Resource type not found', { status: 404 });
	}

	const uri = params.uri;

	if (!uri) {
		throw new Response('No URI found', { status: 400 });
	}

	const api = await composeAuthenticatedApi(userId, sourceType);

	if (!api) {
		throw new Error(`User is not connected to ${capitalize(sourceType)} API`);
		// return redirect(`/connections/${sourceType}`);
	}

	const resource = await importResourceWithType({
		api,
		userId,
		sourceType,
		resourceType,
		uri,
	});

	return redirect(composeResourceUrl(resource));
};
