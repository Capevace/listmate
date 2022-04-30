import { ActionFunction, redirect } from 'remix';
import { detachRemoteUri } from '~/models/resource/resource.server';
import httpFindResource from '~/utilities/http/find-resource';
import httpFindSourceType from '~/utilities/http/find-source-type';

export const action: ActionFunction = async ({ request, params }) => {
	const sourceType = httpFindSourceType(params.sourceType);
	const resource = await httpFindResource(params.resourceId);

	await detachRemoteUri(resource.id, sourceType);

	return redirect(`/resources/${resource.id}/${sourceType}`);
};
