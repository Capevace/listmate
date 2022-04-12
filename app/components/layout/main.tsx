import { Form, Link } from 'remix';
import type { List } from '~/models/list.server';
import type { User } from '~/models/user.server';

type MainAppLayoutProps = {
	user: User;
	lists: List[];
	children: React.ReactNode;
};

function ListRow({ list }: { list: List }) {
	return (
		<div className="flex px-3 py-2 text-gray-500 hover:bg-gray-800 hover:text-gray-400">
			<Link to={`/lists/${list.id}`} className="">
				{list.title}
			</Link>
		</div>
	);
}

export default function MainAppLayout({
	user,
	lists,
	children,
}: MainAppLayoutProps) {
	return (
		<div className="flex h-full">
			<nav className="flex flex-col border-r-2 border-gray-800 bg-gray-900">
				{/* User box */}
				<div className="flex w-full items-center justify-between gap-5 bg-gray-800 px-5 py-3">
					<div className="flex items-center">
						<img
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
							alt="User"
							className="mr-4 h-8 w-8 rounded-full"
						/>
						<div className="text-lg text-white">
							<span className="font-bold">{user.name}</span>
						</div>
					</div>
					<div className="flex items-center">
						<Form action="/logout" method="post">
							<button
								type="submit"
								className="rounded-full bg-gray-700 px-4 py-1 text-sm font-semibold text-white"
							>
								Logout
							</button>
						</Form>
					</div>
				</div>

				<div className="flex flex-col">
					{lists.map((list) => (
						<ListRow key={list.id} list={list} />
					))}
				</div>
			</nav>
			<main className="flex-1 overflow-y-scroll bg-gray-900">{children}</main>
		</div>
	);
}
