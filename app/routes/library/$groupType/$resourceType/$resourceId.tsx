import type {
	Resource,
	ResourceDetails,
	SerializedResource,
	SerializedValues,
} from '~/models/resource/types';
import { ActionFunction, Outlet, MetaFunction } from 'remix';

import { json, useLoaderData, redirect } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourceById } from '~/models/resource/resource.server';

import ResourceView from '~/components/views/resource-view';
import { getResourceDetails } from '~/models/resource/adapters.server';
import composePageTitle from '~/utilities/page-title';
import httpFindResourceType from '~/utilities/http/find-resource-type';
import type { ContextLoaderFunction } from '~/models/context';
import { Except } from 'type-fest';
import {
	deserializeResource,
	serializeResource,
} from '~/models/resource/serialize';

type LoaderData = {
	resource: SerializedResource<Resource>;
	details: ResourceDetails;
};

export const loader = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'resourceId not found');

	const resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	// Validate resource type URL part
	httpFindResourceType(params.resourceType, resource, new URL(request.url));

	const details = await getResourceDetails(resource);

	return json<LoaderData>({ resource: serializeResource(resource), details });
};

export const action: ActionFunction = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	await requireUserId(request, context);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

export type ResourceViewContext = {
	resource: Resource;
};

export const meta: MetaFunction = ({ data }) => {
	if (!data) {
		return { title: composePageTitle('Resource not found') };
	}

	const { resource } = data as LoaderData;

	return {
		title: composePageTitle(resource.title),
	};
};

export default function ResourceDetailsPage() {
	const data = useLoaderData() as LoaderData;

	const resource = deserializeResource(data.resource);

	return (
		<>
			<ResourceView resource={resource} details={data.details} />
			<Outlet />
		</>
	);
}
