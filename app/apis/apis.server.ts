import type { DataObjectRemote, User } from '@prisma/client';
import type { ProgressFunction } from '~/utilities/progress';
import type {
	Resource,
	SourceType,
	ResourceWithoutDefaults,
	ResourceWithSerializedValues,
} from '~/models/resource/types';

import {
	createResource,
	findResourceByRemoteUri,
	upsertResource,
} from '~/models/resource/resource.server';
import { saveFile } from '~/models/file.server';
import { ResourceType } from '~/models/resource/types';
import retry from '~/utilities/retry';

function logEvent(type: ResourceType, ...messages: string[]) {
	console.log(`IMPORT – Spotify – ${type}`, ...messages);
}

export async function importResource<RType extends Resource = Resource>(
	api: SourceType,
	uri: DataObjectRemote['uri'],
	data: ResourceWithoutDefaults<RType>
): Promise<RType> {
	logEvent(data.type, `Importing ${uri}`);

	let previousResource = await findResourceByRemoteUri(api, uri);

	if (previousResource) {
		return (await upsertResource({
			...previousResource,
			...data,
		})) as RType;
	}

	const createdResource = await createResource(data);
	// await attachRemoteUri(createdResource.id, SourceType.SPOTIFY, uri);

	return createdResource as RType;
}

export async function importImage(url: string, name: string) {
	try {
		const res = await fetch(url);
		const buffer = await res.arrayBuffer();

		return saveFile(name, Buffer.from(buffer));
	} catch (e) {
		console.error('Error importing image', e);
		return null;
	}
}

export function retryImport<T>(fn: () => Promise<T>) {
	return retry(fn, 5);
}

export type ImportAPI<APIType> = {
	authenticated: boolean;
	service: APIType;
};

export type ImportParameters<APIType> = {
	api: ImportAPI<APIType>;
	userId: User['id'];
	progress?: ProgressFunction;
};
