import { LoaderFunction } from 'remix';
import { requireUserId } from '~/session.server';

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	return null;
};

export default function Index() {
	return <div>Index</div>;
}
