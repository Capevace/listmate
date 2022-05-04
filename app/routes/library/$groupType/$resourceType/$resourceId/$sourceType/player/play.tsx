import { ActionFunction, json } from 'remix';
import { composeAuthenticatedApi, playResource } from '~/apis/apis.server';
import { SOURCE_NAMES } from '~/models/resource/types';
import { requireUserId } from '~/session.server';
import httpFindResource from '~/utilities/http/find-resource';
import httpFindSourceType from '~/utilities/http/find-source-type';
import type { ContextLoaderFunction } from '~/models/context';

export const action: ActionFunction = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	const userId = await requireUserId(request, context);

	const url = new URL(request.url);
	const deviceId = url.searchParams.get('device_id');
	const sourceType = httpFindSourceType(params.sourceType);
	const resource = await httpFindResource(params.resourceId);
	const api = await composeAuthenticatedApi(userId, sourceType);
	const uri = resource.remotes[sourceType];

	if (!api) {
		throw new Response(`User not connected with ${SOURCE_NAMES[sourceType]}`, {
			status: 401,
		});
	}

	if (!uri) {
		throw new Response(
			`Resource not connected with ${SOURCE_NAMES[sourceType]}`,
			{
				status: 400,
			}
		);
	}

	await playResource({
		api,
		userId,
		sourceType,
		resourceType: resource.type,
		uri: uri,
		deviceId,
	});

	return json({});
};
