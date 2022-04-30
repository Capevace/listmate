import type { LoaderFunction, MetaFunction } from 'remix';

import { requireUserId } from '~/session.server';
import composePageTitle from '~/utilities/page-title';

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	return null;
};

export const meta: MetaFunction = () => {
	return {
		title: composePageTitle('Dashboard'),
	};
};

export default function Index() {
	return <div>Index</div>;
}
