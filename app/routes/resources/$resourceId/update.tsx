import { ActionFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import { requireUserId } from '~/session.server';
import {
	findResourceById,
	upsertResource,
} from '~/models/resource/resource.server';
import { composeResourceUrl } from '~/utilities/resource-url';
import * as zod from 'zod';
import { is } from '@deepkit/type';
import { Data } from '~/models/resource/refs';

export const action: ActionFunction = async ({ params, request, context }) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'No resourceId passed');

	const schema = zod.object({
		title: zod.string().min(1, { message: 'Required' }),
		description: zod.string().min(1).optional(),
	});

	const formData = Object.fromEntries(await request.formData());
	const data = schema.parse(formData);

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	resource.title = data.title;

	if (
		resource.values.description &&
		is<Data<string>>(resource.values.description)
	) {
		resource.values.description = data.description;
	}

	await upsertResource(resource);

	const url = composeResourceUrl(resource);
	return redirect(url);
};
