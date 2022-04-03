import { DataObject, DataObjectRemote, DataObjectValue } from '@prisma/client';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import {
	dataObjectToAlbum,
	dataObjectToArtist,
	dataObjectToSong,
} from '../base/music';
import {
	Resource,
	ResourceType,
	SourceType,
	stringToResourceType,
	stringToSourceType,
} from '../base/resource';

export type ValueMap = { [key: string]: CompleteDataObjectValue };

export type CompleteDataObjectValue = DataObjectValue & {
	// valueDataObject: DataObject | null; // not undefined, cause we want null to be explicit
};

export type CompleteDataObjectRemote = DataObjectRemote & {
	dataObject: DataObject;
	values: CompleteDataObjectValue[];
};

export type CompleteDataObject = DataObject & {
	remotes: CompleteDataObjectRemote[];
};

export function valueListToMap(values: CompleteDataObjectValue[]): ValueMap {
	let object: ValueMap = {};

	for (const value of values) {
		object[value.key] = value;
	}

	return object;
}

export async function getValueAsResource(
	value: CompleteDataObjectValue
): Promise<Resource> {
	invariant(
		value.valueDataObjectId,
		"Can't load dynamic value, missing valueDataObjectId"
	);

	const [firstRemote] = await prisma.dataObjectRemote.findMany({
		where: {
			dataObjectId: value.valueDataObjectId,
		},
		include: {
			dataObject: true,
			values: {
				include: {
					valueDataObject: true,
				},
			},
		},
		take: 1,
	});

	invariant(firstRemote, 'DataObject has no remote');

	return await remoteToResource(firstRemote);
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

export async function remoteToResource(
	remote: CompleteDataObjectRemote
): Promise<Resource> {
	const values = valueListToMap(remote.values);

	switch (remote.dataObject.type) {
		case ResourceType.ALBUM:
			return await dataObjectToAlbum(remote, values);
		case ResourceType.ARTIST:
			return await dataObjectToArtist(remote, values);
		case ResourceType.SONG:
			return await dataObjectToSong(remote, values);
		default:
			throw new Error('Unknown resource type');
	}
}

// function dataObjectToSpotifyResource(
// 	remote: CompleteDataObjectRemote
// ): Resource {
// 	const values = remote.values.reduce((record, value) => {
// 		record[value.key] = value.value;
// 		return record;
// 	}, {} as Record<string, any>);

// 	if (!values.has('id') || !values.has('title')) {
// 		throw new Error('Missing id or title');
// 	}

// 	switch (remote.dataObject.type) {
// 		case ResourceType.ALBUM:
// 			return dataObjectToSpotifyAlbum(remote, values);
// 		default:
// 			throw new Error('Unknown resource type');
// 	}
// }
