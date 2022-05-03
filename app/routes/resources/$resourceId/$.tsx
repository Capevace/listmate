import { LoaderFunction, redirect } from 'remix';
import findResource from '~/utilities/http/find-resource';
import { composeResourceUrl } from '~/utilities/resource-url';

export const loader: LoaderFunction = async ({ request, params }) => {
	const resource = await findResource(params.resourceId);

	if (!resource) {
		throw new Response('Resource not found', { status: 404 });
	}

	return redirect(composeResourceUrl(resource, params['*']));
};
