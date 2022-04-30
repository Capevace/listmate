import { stringToSourceTypeOptional } from '~/models/resource/types';

/**
 * Tries to convert the string to a SourceType or returns a HTTP 404 error.
 * @param type
 */
export default function httpFindSourceType(type?: string) {
	const sourceType = stringToSourceTypeOptional(type);

	if (!sourceType) {
		throw new Response('Not Found', { status: 404 });
	}

	return sourceType;
}
