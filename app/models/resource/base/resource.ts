import { DataObject, DataObjectRemote, DataObjectValue } from '@prisma/client';
import { SetOptional } from 'type-fest';
import { prisma as db } from '~/db.server';

import { SpotifyAlbum } from '../apis/spotify';

export enum ResourceType {
	SONG = 'song',
	BOOKMARK = 'bookmark',
	ARTIST = 'artist',
	ALBUM = 'album',
	PLAYLIST = 'playlist',
}

export function stringToResourceType(type: string): ResourceType {
	switch (type) {
		case 'song':
			return ResourceType.SONG;
		case 'album':
			return ResourceType.ALBUM;
		case 'artist':
			return ResourceType.ARTIST;
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

export function stringToSourceType(type: string): SourceType {
	switch (type) {
		case 'spotify':
			return SourceType.SPOTIFY;
		default:
			throw new Error(`Unknown source type: ${type}`);
	}
}

/* Basic types */
export type Resource = {
	id: string;
	foreignId: string;

	title: string; // always available string, most basic representation of item
	type: ResourceType;
	api: SourceType;
};
const resourceValueBlacklist = ['id', 'title', 'foreignId', 'api', 'type'];

export async function upsertResource(resource: SetOptional<Resource, 'id'>) {
	const remote = await db.dataObjectRemote.upsert({
		where: {
			api_foreignId: {
				api: resource.api,
				foreignId: resource.foreignId,
			},
		},
		// TODO: when used with the if clause below, we can try and find similar dataobjects
		update: {},
		create: {
			id: resource.id,
			api: resource.api,
			foreignId: resource.foreignId,
			dataObject: {
				create: {
					title: resource.title,
					type: resource.type,
				},
			},
		},
		include: {
			dataObject: {
				include: {
					remotes: true,
				},
			},
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

	let values = [];
	const rawValues = Object.entries(resource).filter(
		([key]) => !resourceValueBlacklist.includes(key)
	);

	for (const entry of rawValues) {
		const [key, value] = entry;

		if (typeof value === 'object' && 'id' in value) {
			const valueResource = value as Resource;

			const valueRemote = await upsertResource(valueResource);

			values.push(
				await db.dataObjectValue.upsert({
					where: {
						api_foreignId_key: {
							api: resource.api,
							foreignId: resource.foreignId,
							key,
						},
					},
					update: {
						value: valueRemote.dataObject.title,
						valueDataObjectId: valueRemote.dataObject.id,
					},
					create: {
						api: resource.api,
						foreignId: resource.foreignId,
						key,
						value: valueRemote.dataObject.title,
						valueDataObjectId: valueRemote.dataObject.id,
					},
				})
			);
		} else {
			values.push(
				await db.dataObjectValue.upsert({
					where: {
						api_foreignId_key: {
							api: resource.api,
							foreignId: resource.foreignId,
							key,
						},
					},
					update: {
						value: String(value),
						valueDataObjectId: null,
					},
					create: {
						api: resource.api,
						foreignId: resource.foreignId,
						key,
						value: String(value),
					},
				})
			);
		}
	}

	// If remote was created
	const previousRemoteIndex = remote.dataObject.remotes.findIndex(
		(_remote) => _remote.api === remote.api
	);

	if (previousRemoteIndex !== -1) {
		remote.dataObject.remotes[previousRemoteIndex] = remote;
	} else {
		remote.dataObject.remotes.push(remote);
	}

	return remote;
}

export async function createResources(resourcesToCreate: Resource[]) {
	let resources: Record<string, DataObjectRemote> = {};

	for (const resource of resourcesToCreate) {
		const createdRemote = await upsertResource(resource);
		resources[createdRemote.foreignId] = createdRemote;
	}

	return resources;
}

export function composeResourceBase<
	ForcedType extends ResourceType,
	ForcedSource extends SourceType
>(
	remote: CompleteDataObjectRemote
): Resource & { type: ForcedType; api: ForcedSource } {
	let resource = {
		id: remote.dataObject.id,
		title: remote.dataObject.title,
		type: stringToResourceType(remote.dataObject.type) as ForcedType,
		api: stringToSourceType(remote.api) as ForcedSource,
		foreignId: remote.foreignId,
	};

	// TODO: check if types actually match and this works?

	return resource;
}

export type CompleteDataObjectValue = DataObjectValue & {
	dataObject: DataObject;
};

export type CompleteDataObjectRemote = DataObjectRemote & {
	dataObject: DataObject;
	values: CompleteDataObjectValue[];
};

export type CompleteDataObject = DataObject & {
	remotes: CompleteDataObjectRemote[];
};
