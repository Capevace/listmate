import type { Resource, ResourceDetails } from '~/models/resource/types';
import {
	LoaderFunction,
	ActionFunction,
	Outlet,
	useOutlet,
	MetaFunction,
} from 'remix';

import { json, useLoaderData, redirect } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourceById } from '~/models/resource/resource.server';

import ResourceView from '~/components/views/resource-view';
import { getResourceDetails } from '~/models/resource/adapters.server';
import { Button } from '@mantine/core';
import composePageTitle from '~/utilities/page-title';
import RefreshButton from '~/components/resource/refresh-button';
import { PlayIcon } from '@heroicons/react/solid';
import httpFindResourceType from '~/utilities/http/find-resource-type';
import { composeResourceUrl } from '~/utilities/resource-url';

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

	// Validate resource type URL part
	httpFindResourceType(params.resourceType, resource, new URL(request.url));

	const details = await getResourceDetails(resource);

	return json<LoaderData>({ resource, details });
};

export const action: ActionFunction = async ({ request, params }) => {
	await requireUserId(request);
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

	return (
		<>
			<ResourceView resource={data.resource} details={data.details} />
			<Outlet />
		</>
	);
}
