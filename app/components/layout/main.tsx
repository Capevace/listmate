import type { Collection } from '~/adapters/collection/type';
import type { User } from '~/models/user.server';
import Player from './player';
import Sidebar from './sidebar';

type MainAppLayoutProps = {
	user?: User;
	collections?: Collection[];
	hideSidebar?: boolean;

	children: React.ReactNode;
};

export default function MainAppLayout({
	user,
	collections,
	hideSidebar,
	children,
}: MainAppLayoutProps) {
	return (
		<div className="flex h-full">
			{!hideSidebar && <Sidebar user={user} collections={collections} />}

			<main className="flex flex-1 flex-col overflow-y-scroll bg-gray-50 dark:bg-gray-900">
				{children}
			</main>
		</div>
	);
}
