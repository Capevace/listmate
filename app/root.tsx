import {
	json,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from 'remix';
import type { MetaFunction, LoaderFunction } from 'remix';

import tailwindStylesheetUrl from '~/styles/tailwind.css';
import { getUser } from '~/session.server';
import MainAppLayout from '~/components/layout/main';
import type { User } from '~/models/user.server';
import { getListsForUser, List } from '~/models/list.server';
import { MantineProvider } from '@mantine/core';
import { theme } from '~/styles/mantine.theme';

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Listmates',
	viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
	user: User | null;
	lists: List[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);

	return json<LoaderData>({
		user,
		lists: user ? await getListsForUser({ id: user.id }) : [],
	});
};

export default function App() {
	const { user, lists } = useLoaderData() as LoaderData;

	return (
		<html lang="en" className="h-full">
			{/* 
				TODO: this is awful but necessary, so that tailwind loads AFTER mantine.
				Otherwise tailwinds resets override some mantine stuff.
			*/}
			<link rel="stylesheet" href={tailwindStylesheetUrl} />

			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full text-gray-100">
				<MantineProvider theme={theme}>
					{user ? (
						<MainAppLayout user={user} lists={lists}>
							<Outlet />
						</MainAppLayout>
					) : (
						<Outlet />
					)}
				</MantineProvider>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
