import type { LoaderFunction, ActionFunction } from 'remix';
import { redirect } from 'remix';
import { json, useLoaderData, useCatch, Form } from 'remix';
import invariant from 'tiny-invariant';
import type { List } from '~/models/list.server';
import type { ListItemData } from '~/models/item.server';
import { getList, deleteList } from '~/models/list.server';
import { getItemsForList } from '~/models/item.server';
import { requireUserId } from '~/session.server';
import { ResourceType } from '~/models/resource/base/resource';
import { Song } from '~/models/resource/base/music';
import { Button } from '@mantine/core';

import { PlayIcon, PlusIcon, DotsHorizontalIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';

type LoaderData = {
	list: List;
	items: ListItemData[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	invariant(params.listId, 'listId not found');

	const list = await getList({ id: params.listId });
	const items = await getItemsForList({ id: params.listId });

	if (!list) {
		throw new Response('Not Found', { status: 404 });
	}

	return json<LoaderData>({ list, items });
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

function ListHeader({ list }: { list: List }) {
	return (
		<div className="relative my-5 flex border border-gray-700 bg-gray-800 px-10 py-9 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<div className="flex flex-1 flex-col justify-between">
				<div className="relative mb-5 flex flex-col">
					<h1 className="mb-2 text-4xl font-bold text-gray-100">
						{list.title}
					</h1>
					<p className="text-xl text-gray-300">{list.description}</p>
				</div>
				<nav className="flex flex-shrink-0 gap-3">
					<Form method="post">
						<Button
							type="submit"
							color="pink"
							size="md"
							rightIcon={<PlayIcon className="w-7" />}
						>
							Play
						</Button>
					</Form>
					<Form method="post">
						<Button
							type="submit"
							color="gray"
							size="md"
							rightIcon={<PlusIcon className="w-6" />}
						>
							Add item to list
						</Button>
					</Form>
				</nav>
			</div>
			<aside className="h-48 justify-end">
				<img
					className="h-full rounded-xl shadow-lg"
					src={
						list.coverFileReferenceId
							? `/media/${list.coverFileReferenceId}`
							: `https://dummyimage.com/500x500/374151/d1d5db.png&text=%20%20%20%20%20%20${list.id}`
					}
					alt="List"
				/>
			</aside>
		</div>
	);
}

function GenericItemListRow({
	list,
	item,
}: {
	list: List;
	item: ListItemData;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1 px-5 text-sm text-gray-200"
		>
			<div className="col-span-11">{item.resource.title}</div>
		</li>
	);
}

function SongItemListRow({
	list,
	item,
}: {
	list: List;
	item: ListItemData<Song>;
}) {
	return (
		<li
			key={item.id}
			className="grid w-full grid-cols-12 items-center py-1  text-sm text-gray-200"
		>
			<div className="col-span-1 flex justify-start">
				<button className="text-gray-700 hover:text-gray-400 ">
					<PlayIcon className="w-6 " />
				</button>
			</div>
			<div className="col-span-5 truncate">
				<ResourceValueLabel
					valueRef={item.resource.values.name}
					forceRef={item.resource.id}
				/>
			</div>
			<div className="col-span-3 truncate">
				<ResourceValueLabel valueRef={item.resource.values.artist} />
			</div>
			<div className="col-span-2 truncate">
				<ResourceValueLabel valueRef={item.resource.values.album} />
			</div>
			<div className="col-span-1 flex justify-end">
				<button className="text-gray-700 hover:text-gray-400 ">
					<DotsHorizontalIcon className="w-6 " />
				</button>
			</div>
		</li>
	);
}

function ItemList({ list, items }: Pick<LoaderData, 'list' | 'items'>) {
	return (
		<ul className="flex w-full flex-col px-10">
			{items.map((item) => {
				switch (item.resource.type) {
					case ResourceType.SONG:
						return (
							<SongItemListRow
								key={item.id}
								list={list}
								item={item as ListItemData<Song>}
							/>
						);
					default:
						return <GenericItemListRow key={item.id} list={list} item={item} />;
				}
			})}
		</ul>
	);
}

export default function ListDetailsPage() {
	const data = useLoaderData() as LoaderData;

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			{/* <AddItemForm list={data.list} /> */}
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
