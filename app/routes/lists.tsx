import { json, Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import { List, getListsForUser } from '~/models/list.server';
import { User } from '~/models/user.server';
import { requireUser } from '~/session.server';

type LoaderData = {
	user: User;
	lists: List[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const user = await requireUser(request);
	console.log(user);
	const lists = await getListsForUser({ id: user.id });

	return json<LoaderData>({ user, lists });
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

export default function ListLayout() {
	const { lists } = useLoaderData() as LoaderData;

	return (
		<div className="flex h-full">
			<nav className="flex flex-col bg-gray-800">
				{/* User box */}
				<div className="flex w-full items-center justify-between gap-5 bg-gray-800 px-5 py-3">
					<div className="flex items-center">
						<img
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
							alt="User"
							className="mr-4 h-8 w-8 rounded-full"
						/>
						<div className="text-lg text-white">
							<span className="font-bold">John Does</span>
						</div>
					</div>
					<div className="flex items-center">
						<button className="rounded-full bg-gray-700 px-4 py-1 text-sm font-semibold text-white">
							Logout
						</button>
					</div>
				</div>

				<div className="flex flex-col">
					<pre>{JSON.stringify(lists, null, 2)}</pre>
					{lists.map((list) => (
						<ListRow key={list.id} list={list} />
					))}
				</div>
			</nav>
			<main className="flex-1 bg-gray-900">
				<Outlet />
			</main>
		</div>
	);
}
