import { Resource, RESOURCE_GROUP_MAP } from '~/models/resource/types';

const composeSuffix = (suffix?: string) => (suffix ? `/${suffix}` : '');

export function composeResourceUrl(
	resource: Resource,
	suffix?: string
): string {
	const groupType = RESOURCE_GROUP_MAP[resource.type];

	return `/library/${groupType}/${resource.type}/${resource.id}${composeSuffix(
		suffix
	)}`;
}

export function composeShortResourceUrl(
	resourceId: Resource['id'],
	suffix?: string
): string {
	return `/resources/${resourceId}${composeSuffix(suffix)}`;
}
