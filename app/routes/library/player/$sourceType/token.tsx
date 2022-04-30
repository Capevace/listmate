import { json, LoaderFunction } from 'remix';
import { composeAuthenticatedApi, getPlayerToken } from '~/apis/apis.server';
import { requireUserId } from '~/session.server';
import httpFindSourceType from '~/utilities/http/find-source-type';

type LoaderData = {
	token: { accessToken?: string };
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	const sourceType = httpFindSourceType(params.sourceType);

	if (!sourceType) {
		throw new Response(`Source type not found: ${params.sourceType}`, {
			status: 404,
		});
	}

	const api = await composeAuthenticatedApi(userId, sourceType);

	if (!api) {
		throw new Response(`User not connected with ${sourceType}`, {
			status: 401,
		});
	}

	const token = await getPlayerToken(api, sourceType);

	return json<LoaderData>({
		token,
	});
};
