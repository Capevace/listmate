import { useCatch, Outlet } from 'remix';
import ErrorView from '~/components/views/error-view';

export const loader = () => null;

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return (
		<ErrorView message={error.message} className="mt-20" />
	);
}

export function CatchBoundary() {
	const caught = useCatch();
	console.log('lol')

	if (caught.status === 404) {
		return (
			<ErrorView status={401} className="mt-20" />
		);
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export default function LibraryPage() {
	return <Outlet />;
}