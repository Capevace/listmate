import {
	json,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	useLoaderData,
} from 'remix';
import type { MetaFunction, LoaderFunction } from 'remix';

import tailwindStylesheetUrl from '~/styles/tailwind.css';
import metaStylesheetUrl from '~/styles/meta-styles.css';
import { getUser } from '~/session.server';
import MainAppLayout from '~/components/layout/main';
import type { User } from '~/models/user.server';
import { getListsForUser, List } from '~/models/list.server';
import { MantineProvider } from '@mantine/core';
import { theme } from '~/styles/mantine.theme';
import ErrorView from './components/views/error-view';

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
				<link rel="stylesheet" href={metaStylesheetUrl} />
			</head>
			<body className="no-js h-full bg-gray-900 text-gray-100">
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: "document.body.classList.remove('no-js');",
					}}
				></script>
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

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return (
		<html>
			<head>
				<title>Oh no! – Listmate</title>
				<Meta />
				<Links />
				<link rel="stylesheet" href={tailwindStylesheetUrl} />
			</head>
			<body className="flex h-screen flex-col items-center justify-center bg-red-600 text-red-100">
				{/* Error view without message/status shows unknown error */}
				<ErrorView message={error.message} />
				<Scripts />
			</body>
		</html>
	);
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return <div>Resource not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
