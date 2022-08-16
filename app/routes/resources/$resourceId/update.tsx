import { ActionFunction, redirect } from 'remix';
import invariant from 'tiny-invariant';
import { requireUserId } from '~/session.server';
import {
	findResourceById,
	upsertResource,
} from '~/models/resource/resource.server';
import { composeResourceUrl } from '~/utilities/resource-url';
import * as zod from 'zod';
import { deserialize, is } from '@deepkit/type';
import { Data, DescriptionValue, TitleValue } from '~/models/resource/refs';

export const action: ActionFunction = async ({ params, request, context }) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'No resourceId passed');

	const formData = await request.formData();

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	resource.title = deserialize<TitleValue>(formData.get('title'));

	if (
		resource.values.description &&
		is<Data<string>>(resource.values.description)
	) {
		resource.values.description.value = deserialize<DescriptionValue>(
			formData.get('description')
		);
	}

	await upsertResource(resource);

	const url = composeResourceUrl(resource);
	return redirect(url);
};
