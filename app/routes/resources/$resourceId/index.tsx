import type { Resource, ResourceDetails } from '~/models/resource/types';
import type { LoaderFunction, ActionFunction } from 'remix';

import { json, useLoaderData, useCatch, redirect } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourceById } from '~/models/resource/resource.server';

import MainView from '~/components/views/main-view';
import ResourceView from '~/components/views/resource-view';
import { getResourceDetails } from '~/models/resource/adapters.server';

type LoaderData = {
	resource: Resource;
	details: ResourceDetails;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	invariant(params.resourceId, 'resourceId not found');

	const resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	const details = await getResourceDetails(resource);

	return json<LoaderData>({ resource, details });
};

export const action: ActionFunction = async ({ request, params }) => {
	await requireUserId(request);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

export default function ResourceDetailsPage() {
	const data = useLoaderData() as LoaderData;

	return <ResourceView resource={data.resource} details={data.details} />;
}
