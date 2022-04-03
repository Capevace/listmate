import { ActionFunction, useLoaderData } from 'remix';
import { redirect } from 'remix';

type LoaderData = {
	list: List;
};

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);
	invariant(params.listId, 'listId not found');

	// await c({ userId, id: params.listId });

	return redirect('/lists');
};

export default function AddItemPage() {
	const data = useLoaderData() as LoaderData;

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			{/* <AddItemForm list={data.list} /> */}
		</div>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return <div>List not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
