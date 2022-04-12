import { LoaderFunction } from 'remix';
import invariant from 'tiny-invariant';
import { getContentType, getFile, getFilePath } from '~/models/file.server';
import * as fs from '~/fs.server';

export const loader: LoaderFunction = async ({ request, params }) => {
	const id = params.fileReferenceId;

	invariant(id, 'Expected file reference ID');

	const file = await getFile(id);

	if (!file) {
		return new Response(null, {
			status: 404,
		});
	}

	const path = getFilePath(file);
	const contentType = getContentType(file);
	const contents = await fs.readFile(path);

	return new Response(contents, {
		headers: {
			'Content-Type': contentType || 'application/octet-stream, charset=utf-8',
		},
	});
};

// export default function ListIndexPage() {
// 	const { lists } = useLoaderData() as LoaderData;

// 	return (
// 		<div>
// 			<h1>Lists</h1>
// 			<div className="flex flex-col">
// 				{lists.map((list) => (
// 					<ListRow key={list.id} list={list} />
// 				))}
// 			</div>
// 		</div>
// 	);
// }
