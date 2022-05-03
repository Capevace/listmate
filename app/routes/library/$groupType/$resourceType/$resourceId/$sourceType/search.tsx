import { ActionFunction } from 'remix';
import {
	composeAuthenticatedApi,
	detectSourceType,
	ImportAPI,
	searchForResourceWithType,
} from '~/apis/apis.server';
import {
	SourceType,
	stringToSourceTypeOptional,
} from '~/models/resource/types';
import { requireUserId } from '~/session.server';

// Remix action to search with an authenticated API
export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	const formData = await request.formData();
	const uri = formData.get('uri');
	const providedSourcePath = stringToSourceTypeOptional(
		formData.get('sourceType')?.toString()
	);

	if (!uri) {
		throw new Response('No URI provided', {
			status: 400,
		});
	}

	const detectedSourceTypes = await detectSourceType(uri.toString());

	let apis: { [key in SourceType]?: ImportAPI<key, unknown> } = {};

	const lookupPromises = detectedSourceTypes.map(async (validatedUri) => {
		const api =
			apis[validatedUri.sourceType] ??
			(await composeAuthenticatedApi(userId, validatedUri.sourceType));

		if (!api) return null;

		const results = await searchForResourceWithType({
			api,
			userId,
			...validatedUri,
			search:
		});
	});

	if (!sourceTypes.length) {
		throw new Response('No source type provided', {
			status: 400,
		});
	}

	return json<LoaderData>({
		resource: request.resource,
		sourceType: request.sourceType,
		searchResults,
	});
};
