import { LoaderFunction, redirect } from 'remix';
import { GROUP_SOURCE_MAP } from '~/models/resource/group-type';
import findResource from '~/utilities/http/find-resource';
import { composeResourceUrl } from '~/utilities/resource-url';

export const loader: LoaderFunction = async ({ request, params }) => {
	const resource = await findResource(params.resourceId);

	group;
	GROUP_SOURCE_MAP;

	return redirect(composeResourceUrl(resource, params['*']));
};
