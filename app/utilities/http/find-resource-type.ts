import { redirect } from 'remix';
import {
	Resource,
	stringToResourceTypeOptional,
} from '~/models/resource/types';
import { composeResourceUrl } from '../resource-url';

/**
 * Tries to convert the string to a SourceType or returns a HTTP 404 error.
 * @param type
 */
export default function httpFindResourceType(
	type?: string,
	validateWith?: Resource | null,
	url?: URL,
	suffixAfter?: string
) {
	const resourceType = stringToResourceTypeOptional(type);

	if (!resourceType) {
		throw new Response('Not Found', { status: 404 });
	}

	if (validateWith && resourceType !== validateWith.type) {
		const falseUrlBase = composeResourceUrl({
			...validateWith,
			type: resourceType,
		});
		const correctUrlBase = composeResourceUrl(validateWith);
		const correctUrl = url?.pathname.replace(falseUrlBase, correctUrlBase);

		throw redirect(correctUrl ?? correctUrlBase);
	}
	return resourceType;
}
