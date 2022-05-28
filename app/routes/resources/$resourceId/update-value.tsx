import type { ActionFunction } from 'remix';
import { redirect } from 'remix';
import invariant from 'tiny-invariant';
import { requireUserId } from '~/session.server';
import {
	findResourceById,
	upsertValues,
} from '~/models/resource/resource.server';
import { composeResourceUrl } from '~/utilities/resource-url';
import * as zod from 'zod';
import type { ValueRef } from '~/models/resource/types';
import {
	SongDataSchema,
	stringToOptionalValueType,
	ValueType,
} from '~/models/resource/types';

export const action: ActionFunction = async ({ params, request, context }) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'No resourceId passed');

	const metaSchema = zod.object({
		// ref: zod.string().uuid().optional(),
		type: zod.nativeEnum(ValueType).default(ValueType.TEXT),
		key: zod.string().trim(),
	});
	const valueSchemas = SongDataSchema;

	const rawFormData = await request.formData();
	const formData = Object.fromEntries(rawFormData);
	const metadata = metaSchema.parse(formData);

	const valueType = stringToOptionalValueType(metadata.type);

	if (!valueType) {
		throw new Response('Invalid value type', { status: 400 });
	}

	if (!(metadata.key in valueSchemas)) {
		throw new Response('Invalid key', { status: 400 });
	}

	const value = valueSchemas[metadata.key as keyof typeof valueSchemas].parse(
		formData.value
	);

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	let valueRef: ValueRef<typeof valueType> | null = value
		? {
				value: value,
				type: valueType,
				ref: null,
		  }
		: null;

	await upsertValues(resource, { [metadata.key]: valueRef });

	const url =
		rawFormData.get('redirectUrl')?.toString() ?? composeResourceUrl(resource);
	return redirect(url);
};
