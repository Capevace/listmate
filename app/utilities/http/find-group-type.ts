import { redirect } from 'remix';
import {
	Resource,
	RESOURCE_GROUP_MAP,
	stringToGroupTypeOptional,
	stringToResourceTypeOptional,
} from '~/models/resource/types';
import { composeResourceUrl } from '../resource-url';

/**
 * Tries to convert the string to a SourceType or returns a HTTP 404 error.
 * @param type
 */
export default function httpFindGroupType(
	type?: string,
	validateWith?: Resource | null,
	url?: URL,
	suffixAfter?: string
) {
	const groupType = stringToGroupTypeOptional(type);
	const resourceType = stringToResourceTypeOptional(validateWith?.type);
	const resourceGroupType = resourceType
		? RESOURCE_GROUP_MAP[resourceType]
		: null;

	if (!groupType) {
		throw new Response('Not Found', { status: 404 });
	}

	if (validateWith && resourceGroupType && groupType !== resourceGroupType) {
		const correctUrlBase = composeResourceUrl(validateWith);

		throw redirect(correctUrlBase);
	}

	return groupType;
}
