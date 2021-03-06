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
import { MantineProvider } from '@mantine/core';
import { theme } from '~/styles/mantine.theme';
import ErrorView from './components/views/error-view';
import {
	findResourcesByType,
	findResourcesByTypes,
} from './models/resource/resource.server';
import { Collection, ResourceType } from './models/resource/types';
import { PlayerProvider } from './components/player/provider';
import { ContextLoaderFunction } from './models/context';

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Listmate',
	viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
	user: User | null;
	collections: Collection[];
};

export const loader: LoaderFunction = async ({
	request,
	context,
}: ContextLoaderFunction) => {
	const user = await getUser(request, context);

	return json<LoaderData>({
		user,
		collections: user
			? ((await findResourcesByTypes([
					ResourceType.COLLECTION,
					ResourceType.PLAYLIST,
			  ])) as Collection[])
			: [],
	});
};

type FrameProps = {
	children: React.ReactNode;
	hideSidebar?: boolean;
	user?: User;
	collections?: Collection[];
};

function Frame({ children, hideSidebar, user, collections }: FrameProps) {
	return (
		<html lang="en" className="dark h-full">
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
			<body className="no-js h-screen bg-theme-100 text-theme-900 antialiased dark:bg-theme-900 dark:text-theme-100">
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: "document.body.classList.remove('no-js');",
					}}
				></script>

				<MantineProvider theme={theme}>
					<PlayerProvider>
						<MainAppLayout
							hideSidebar={hideSidebar}
							user={user}
							collections={collections}
						>
							{children}
						</MainAppLayout>
					</PlayerProvider>
				</MantineProvider>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export default function App() {
	const { user, collections } = useLoaderData() as LoaderData;

	return (
		<Frame user={user || undefined} collections={collections}>
			<Outlet />
		</Frame>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error('root: ErrorBoundary', error);

	return (
		<Frame hideSidebar>
			<ErrorView message={error.message} className="mt-20" />
		</Frame>
	);
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return (
			<Frame hideSidebar>
				<ErrorView status={caught.status} className="mt-20" />
			</Frame>
		);
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
