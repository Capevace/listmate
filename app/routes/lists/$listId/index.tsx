import type { LoaderFunction, ActionFunction } from 'remix';
import { redirect } from 'remix';
import { json, useLoaderData, useCatch } from 'remix';
import invariant from 'tiny-invariant';
import type { List } from '~/models/list.server';
import type { ListItemData } from '~/models/item.server';
import { getList } from '~/models/list.server';
import { getItemsForList } from '~/models/item.server';
import { requireUserId } from '~/session.server';
import ListView from '~/components/views/list-view';
import MainView from '~/components/views/main-view';
import { findOptionalPageQuery } from '~/utilities/paginate';

type LoaderData = {
	list: List;
	items: ListItemData[];
	page?: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);
	invariant(params.listId, 'listId not found');

	const page = findOptionalPageQuery(request.url);

	const list = await getList({ id: params.listId });
	const items = await getItemsForList({ id: params.listId });

	if (!list) {
		throw new Response('Not Found', { status: 404 });
	}

	return json<LoaderData>({ list, items, page });
};

export const action: ActionFunction = async ({ request, params }) => {
	await requireUserId(request);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

export default function ListPage() {
	const data = useLoaderData<LoaderData>();

	return <ListView list={data.list} items={data.items} page={data.page} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return <div>List not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
