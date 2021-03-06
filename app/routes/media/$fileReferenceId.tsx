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

	try {
		const contents = await fs.readFile(path);

		return new Response(contents, {
			headers: {
				'Content-Type':
					contentType || 'application/octet-stream, charset=utf-8',
				'Cache-Control': 'public,max-age=31536000,immutable',
			},
		});
	} catch (e) {
		return new Response(null, {
			status: 404,
		});
	}
};
