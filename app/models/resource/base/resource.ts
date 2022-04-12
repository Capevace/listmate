import type { DataObject, DataObjectValue } from '@prisma/client';
import invariant from 'tiny-invariant';
import { SetOptional } from 'type-fest';
import { prisma as db } from '~/db.server';
import { dataObjectToResource } from '../adapters/remote';

// // Some types are not exported from @prisma/client, so we need to manually
// // create them.
// type DataObjectRemoteInclude = {
// 	remote: {
// 		include: {
// 			dataObject: boolean;
// 			values: {
// 				include: {
// 					valueDataObject: boolean;
// 				};
// 			};
// 		};
// 	};
// };

export enum ResourceType {
	SONG = 'song',
	BOOKMARK = 'bookmark',
	ARTIST = 'artist',
	ALBUM = 'album',
	PLAYLIST = 'playlist',
}

export function stringToResourceType(type: string): ResourceType {
	switch (type) {
		case 'bookmark':
			return ResourceType.BOOKMARK;
		case 'song':
			return ResourceType.SONG;
		case 'album':
			return ResourceType.ALBUM;
		case 'artist':
			return ResourceType.ARTIST;
		case 'playlist':
			return ResourceType.PLAYLIST;
		default:
			throw new Error(`Unknown resource type: ${type}`);
	}
}

export enum SourceType {
	LOCAL = 'local',
	SPOTIFY = 'spotify',
	YOUTUBE = 'youtube',
	SOUNDCLOUD = 'soundcloud',
	POCKET = 'pocket',
}

export const ALL_SOURCE_TYPES = [
	'local',
	'spotify',
	'youtube',
	'soundcloud',
	'pocket',
];

export function stringToSourceType(type: string): SourceType {
	switch (type) {
		case 'local':
			return SourceType.LOCAL;
		case 'spotify':
			return SourceType.SPOTIFY;
		case 'youtube':
			return SourceType.YOUTUBE;
		case 'soundcloud':
			return SourceType.SOUNDCLOUD;
		case 'pocket':
			return SourceType.POCKET;
		default:
			throw new Error(`Unknown source type: ${type}`);
	}
}

export type ValueRefMap = { [key: string]: ValueRef<any> | null };

/* Basic types */
export type Resource = {
	id: string;
	// foreignId: string;

	title: string; // always available string, most basic representation of item
	type: ResourceType;
	// api: SourceType;
	values: ValueRefMap;
};

export type RawValue<ValueType = string> = {
	value: ValueType;
};

export type ValueRef<ValueType> = RawValue<ValueType> & {
	ref?: Resource['id'];
	value: ValueType;
};

export function composeRefFromValue<ValueType extends any = string>(
	value?: DataObjectValue
): RawValue<ValueType> | ValueRef<ValueType> | null {
	return value
		? ({
				ref: value.valueDataObjectId,
				value: value.value,
		  } as ValueRef<ValueType>)
		: null;
}

export function composeRefFromResource<ValueType extends any = string>(
	resource?: Resource
): ValueRef<ValueType> | null {
	return resource
		? ({
				ref: resource.id,
				value: resource.title,
		  } as ValueRef<ValueType>)
		: null;
}

export async function upsertResource(resource: SetOptional<Resource, 'id'>) {
	const dataObject = await db.dataObject.upsert({
		where: {
			id: resource.id,
		},
		// TODO: when used with the if clause below, we can try and find similar dataobjects
		update: { id: resource.id },
		create: {
			id: resource.id,
			title: resource.title,
			type: resource.type,
		},
		include: {
			remotes: true,
		},
	});

	// === DONT DELETE THIS, needed later ===
	// if (remote) {
	// 	remote = await db.dataObjectRemote.update({
	// 		where: {
	// 			api_foreignId: {
	// 				api: resource.api,
	// 				foreignId: resource.foreignId,
	// 			},
	// 		},
	// 		data: {},
	// 		include: {
	// 			dataObject: {
	// 				include: {
	// 					remotes: true,
	// 				},
	// 			},
	// 			values: true,
	// 		},
	// 	});
	// } else {
	// 	// TODO: find similar data objects

	// 	remote = await db.dataObjectRemote.create({
	// 		data: {},
	// 		include: {
	// 			dataObject: {
	// 				include: {
	// 					remotes: true,
	// 				},
	// 			},
	// 			values: true,
	// 		},
	// 	});
	// }
	// === ok you can delete again	===

	// type ResourceData = Except<Resource, 'id' | 'type' | 'title'>;

	let values = [];

	for (const [key, valueRef] of Object.entries(resource.values)) {
		console.log(key, valueRef, resource);

		if (!valueRef) continue;

		values.push(
			await db.dataObjectValue.upsert({
				where: {
					dataObjectId_key: {
						dataObjectId: dataObject.id,
						key,
					},
				},
				update: {
					value: valueRef.value,
					valueDataObjectId: valueRef.ref,
				},
				create: {
					dataObjectId: dataObject.id,
					key,
					value: valueRef.value,
					valueDataObjectId: valueRef.ref,
				},
			})
		);
	}

	// If remote was created
	// const previousRemoteIndex = remote.dataObject.remotes.findIndex(
	// 	(_remote) => _remote.api === remote.api
	// );

	// if (previousRemoteIndex !== -1) {
	// 	remote.dataObject.remotes[previousRemoteIndex] = remote;
	// } else {
	// 	remote.dataObject.remotes.push(remote);
	// }

	const fullObject = await db.dataObject.findUnique({
		where: {
			id: dataObject.id,
		},
		include: {
			remotes: true,
			values: true,
		},
	});

	invariant(fullObject, 'Could not upsert data object');

	return fullObject;
}

export async function getResourceById(
	id: Resource['id']
): Promise<Resource | null> {
	const dataObject = await db.dataObject.findUnique({
		where: {
			id,
		},
		include: {
			remotes: true,
			values: true,
		},
	});

	return dataObject ? await dataObjectToResource(dataObject) : null;
}

export async function createResources(
	resourcesToCreate: SetOptional<Resource, 'id'>[]
) {
	let resources: Record<string, DataObject> = {};

	for (const resource of resourcesToCreate) {
		const createdObject = await upsertResource(resource);
		resources[createdObject.id] = createdObject;
	}

	return resources;
}

export async function createResource(
	resourcesToCreate: SetOptional<Resource, 'id'>[]
) {
	let resources: Record<string, DataObject> = {};

	for (const resource of resourcesToCreate) {
		const createdObject = await upsertResource(resource);
		resources[createdObject.id] = createdObject;
	}

	return resources;
}
