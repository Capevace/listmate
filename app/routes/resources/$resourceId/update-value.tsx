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
import {
	Album,
	AlbumData,
	ResourceType,
	Song,
	SongData,
	stringToOptionalValueType,
	ValueType,
} from '~/models/resource/types';
import { deserialize, valuesOf } from '@deepkit/type';

type ResourceDataFromType<TResourceType extends ResourceType> =
	TResourceType extends ResourceType.ALBUM ? AlbumData : SongData;

type ResourceKeys<TResourceType extends ResourceType> =
	keyof ResourceDataFromType<TResourceType>;

type DataFromKey<
	TResourceType extends ResourceType,
	ValueKey extends ResourceKeys<TResourceType>
> = ResourceDataFromType<TResourceType>[ValueKey];

function deserializeValue<
	TResourceType extends ResourceType,
	ValueKey extends ResourceKeys<TResourceType>
>(
	type: TResourceType,
	key: ValueKey,
	value: any
): DataFromKey<TResourceType, ValueKey> {
	if (!valuesOf<ValueKey>().includes(key)) {
		throw new Error(`Resource type ${type} has no data value with key: ${key}`);
	}

	return deserialize<DataFromKey<TResourceType, ValueKey>>(value);
}

export const action: ActionFunction = async ({ params, request, context }) => {
	await requireUserId(request, context);

	invariant(params.resourceId, 'No resourceId passed');

	let resource = await findResourceById(params.resourceId);

	if (!resource) {
		throw new Response('Not Found', { status: 404 });
	}

	const metaSchema = zod.object({
		// ref: zod.string().uuid().optional(),
		type: zod.nativeEnum(ValueType).default(ValueType.TEXT),
		key: zod.string().trim(),
	});
	const valueSchemas = SongDataSchema;

	const rawFormData = await request.formData();
	const key = deserialize<ResourceKeys<typeof resource.type>>(
		rawFormData.get('key')
	);
	const value = deserializeValue(resource.type, key, rawFormData.get(key));

	const metadata = metaSchema.parse(formData);

	const valueType = stringToOptionalValueType(metadata.type);

	if (!valueType) {
		throw new Response('Invalid value type', { status: 400 });
	}

	if (!(metadata.key in valueSchemas)) {
		throw new Response('Invalid key', { status: 400 });
	}

	// const value = valueSchemas[metadata.key as keyof typeof valueSchemas].parse(
	// 	formData.value
	// );

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
