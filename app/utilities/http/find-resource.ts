import { findResourceById } from '~/models/resource/resource.server';

/**
 * Tries to convert the string to a SourceType or returns a HTTP 404 error.
 * @param type
 */
export default async function httpFindResource(resourceId?: string) {
	if (!resourceId) {
		throw new Response('Not Found', { status: 404 });
	}

	const resource = await findResourceById(resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	return resource;
}
