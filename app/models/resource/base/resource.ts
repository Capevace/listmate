import type {
	DataObjectRemote,
	DataObjectValue,
	FileReference,
} from '@prisma/client';
import invariant from 'tiny-invariant';
import { Except } from 'type-fest';
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
	// uri: string;

	title: string; // always available string, most basic representation of item
	type: ResourceType;

	thumbnail: FileReference | null;

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

async function upsertValues(resource: Resource) {
	for (const [key, valueRef] of Object.entries(resource.values)) {
		if (!valueRef) continue;

		await db.dataObjectValue.upsert({
			where: {
				dataObjectId_key: {
					dataObjectId: resource.id,
					key,
				},
			},
			update: {
				value: valueRef.value,
				valueDataObjectId: valueRef.ref,
			},
			create: {
				dataObjectId: resource.id,
				key,
				value: valueRef.value,
				valueDataObjectId: valueRef.ref,
			},
		});
	}
}

export async function upsertResource(resource: Resource) {
	const dataObject = await db.dataObject.upsert({
		where: {
			id: resource.id,
		},
		// TODO: when used with the if clause below, we can try and find similar dataobjects
		update: {
			title: resource.title,
			type: resource.type,
			thumbnailFileId: resource.thumbnail?.id || null,
		},
		create: {
			id: resource.id,
			title: resource.title,
			type: resource.type,
			thumbnailFileId: resource.thumbnail?.id || null,
		},
		include: {
			remotes: true,
		},
	});

	await upsertValues(resource);

	const fullObject = await db.dataObject.findUnique({
		where: {
			id: dataObject.id,
		},
		include: {
			remotes: true,
			values: true,
			thumbnail: true,
		},
	});

	invariant(fullObject, 'Could not upsert data object');

	return dataObjectToResource(fullObject);
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
			thumbnail: true,
		},
	});

	return dataObject ? await dataObjectToResource(dataObject) : null;
}

export async function createResources(resourcesToCreate: Resource[]) {
	let resources: Record<string, Resource> = {};

	for (const resource of resourcesToCreate) {
		const createdObject = await upsertResource(resource);
		resources[createdObject.id] = createdObject;
	}

	return resources;
}

export async function createResource(
	resource: Except<Resource, 'id'>
): Promise<Resource> {
	const dataObject = await db.dataObject.create({
		data: {
			title: resource.title,
			type: resource.type,
			thumbnailFileId: resource.thumbnail?.id || null,
		},
	});

	await upsertValues({ ...resource, id: dataObject.id });

	const fullObject = await db.dataObject.findUnique({
		where: {
			id: dataObject.id,
		},
		include: {
			remotes: true,
			values: true,
			thumbnail: true,
		},
	});

	invariant(fullObject, 'Could not create resource');

	return dataObjectToResource(fullObject);
}
export async function getResourceByRemoteUri(
	api: SourceType,
	uri: DataObjectRemote['uri']
) {
	console.log('api', api, uri);
	const remote = await db.dataObjectRemote.findUnique({
		where: {
			api_uri: {
				api,
				uri,
			},
		},
	});

	if (!remote) return null;

	return getResourceById(remote.dataObjectId);
}

export async function attachRemoteUri(
	resourceId: Resource['id'],
	api: SourceType,
	uri: DataObjectRemote['uri']
) {
	return db.dataObjectRemote.create({
		// where: {
		// 	api_uri: {
		// 		api,
		// 		uri,
		// 	},
		// },
		// update: {},
		data: {
			dataObjectId: resourceId,
			api,
			uri,
		},
	});
}

export function attachFileToResource(
	resourceId: string,
	fileRef: FileReference
) {
	return db.dataObject.update({
		where: {
			id: resourceId,
		},
		data: {
			thumbnailFileId: fileRef.id,
		},
	});
}
