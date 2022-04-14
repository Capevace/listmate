import type { LoaderFunction, ActionFunction } from 'remix';
import { redirect } from 'remix';
import { json, useLoaderData, useCatch } from 'remix';
import invariant from 'tiny-invariant';
import { requireUserId } from '~/session.server';
import ResourceView from '~/components/views/resource-view';
import { findResourceById } from '~/models/resource/resource.server';
import { Resource } from '~/models/resource/resource.types';

type LoaderData = {
	resource: Resource;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	invariant(params.resourceId, 'resourceId not found');

	const resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	return json<LoaderData>({ resource });
};

export const action: ActionFunction = async ({ request, params }) => {
	await requireUserId(request);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

export default function ResourceDetailsPage() {
	const data = useLoaderData() as LoaderData;

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<ResourceView resource={data.resource} />
		</div>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return <div>Resource not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
