import type { List } from '~/models/list.server';
import type { User } from '~/models/user.server';
import Sidebar from './sidebar';

type MainAppLayoutProps = {
	user?: User;
	lists?: List[];
	hideSidebar?: boolean;

	children: React.ReactNode;
};

export default function MainAppLayout({
	user,
	lists,
	hideSidebar,
	children,
}: MainAppLayoutProps) {
	return (
		<div className="flex h-full">
			{!hideSidebar && <Sidebar user={user} lists={lists} />}

			<main className="flex flex-1 flex-col overflow-y-scroll bg-gray-900">
				{children}
			</main>
		</div>
	);
}
