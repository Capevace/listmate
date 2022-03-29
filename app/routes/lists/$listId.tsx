import type { LoaderFunction, ActionFunction } from 'remix';
import { redirect } from 'remix';
import { json, useLoaderData, useCatch, Form } from 'remix';
import invariant from 'tiny-invariant';
import type { List } from '~/models/list.server';
import type { ListItem } from '~/models/item.server';
import { getList, deleteList } from '~/models/list.server';
import { getListItemsForList } from '~/models/item.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
	list: List;
	items: Array<ListItem>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	invariant(params.listId, 'listId not found');

	const list = await getList({ userId, id: params.listId });
	const items = await getListItemsForList({ id: params.listId });

	if (!list) {
		throw new Response('Not Found', { status: 404 });
	}

	return json<LoaderData>({ list, items });
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	invariant(params.listId, 'listId not found');

	await deleteList({ userId, id: params.listId });

	return redirect('/lists');
};

function ListHeader({ list }: { list: List }) {
	return (
		<div className="relative my-5 bg-gray-900 bg-gradient-to-tr from-gray-900 to-gray-700 px-10 pt-24 pb-8 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<div className="relative mb-4 flex flex-col">
				<h1 className="mb-2 text-4xl font-bold text-gray-50">{list.title}</h1>
				<p className="text-xl text-gray-300">{list.description}</p>
			</div>
			<nav className="flex">
				<Form method="post">
					<button
						type="submit"
						className="rounded bg-gray-500 py-1 px-4 text-white hover:bg-gray-600 focus:bg-gray-400"
					>
						Delete
					</button>
				</Form>
			</nav>
		</div>
	);
}

function AddItemForm({ list }: { list: List }) {
	return (
		<div className="relative my-5 bg-gray-900 bg-gradient-to-tr from-gray-900 to-gray-700 px-10 pt-24 pb-8 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<Form method="post">
				<input type="text" name="title" />
				<button
					type="submit"
					className="rounded bg-gray-500 py-1 px-4 text-white hover:bg-gray-600 focus:bg-gray-400"
				>
					Add to list
				</button>
			</Form>
		</div>
	);
}

function ItemList({ list, items }: Pick<LoaderData, 'list' | 'items'>) {
	return (
		<ul className="flex w-full flex-col">
			{items.map((item) => (
				<li
					key={item.id}
					className="grid w-full grid-cols-12 items-center py-1 px-5"
				>
					<div className="col-span-2 flex justify-center">
						<button
							type="submit"
							className="rounded bg-gray-500 py-1 px-4 text-white hover:bg-gray-600 focus:bg-gray-400"
						>
							Play
						</button>
					</div>
					<div className="col-span-8">{item.title}</div>
				</li>
			))}
		</ul>
	);
}

export default function ListDetailsPage() {
	const data = useLoaderData() as LoaderData;

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<AddItemForm list={data.list} />
			<ListHeader list={data.list} />

			<ItemList list={data.list} items={data.items} />
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
		return <div>List not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
