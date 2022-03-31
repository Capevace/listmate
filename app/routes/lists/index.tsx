import { json, Link, LoaderFunction, useLoaderData } from 'remix';
import { List, getListsForUser } from '~/models/list.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
	lists: List[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	const lists = await getListsForUser({ id: userId });

	return json<LoaderData>({ lists });
};

function ListRow({ list }: { list: List }) {
	return (
		<div className="flex">
			<Link
				to={`/lists/${list.id}`}
				className="text-gray-500 hover:text-gray-700"
			>
				{list.title}
			</Link>
		</div>
	);
}

export default function ListIndexPage() {
	const { lists } = useLoaderData() as LoaderData;

	return (
		<div>
			<h1>Lists</h1>
			<div className="flex flex-col">
				{lists.map((list) => (
					<ListRow key={list.id} list={list} />
				))}
			</div>
		</div>
	);
}
