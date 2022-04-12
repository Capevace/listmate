import {
	DataObject,
	DataObjectRemote,
	DataObjectValue,
	FileReference,
} from '@prisma/client';
import {
	dataObjectToAlbum,
	dataObjectToArtist,
	dataObjectToSong,
} from '../base/music';
import { Resource, ResourceType, stringToResourceType } from '../base/resource';

export type ValueMap = { [key: string]: DataObjectValue };

export type CompleteDataObjectValue = DataObjectValue & {
	valueDataObject: DataObject | null; // not undefined, cause we want null to be explicit
};

export type CompleteDataObject = DataObject & {
	remotes: DataObjectRemote[];
	values: DataObjectValue[];
	thumbnail: FileReference | null;
};

export function valueListToMap(values: DataObjectValue[]): ValueMap {
	let object: ValueMap = {};

	for (const value of values) {
		object[value.key] = value;
	}

	return object;
}

// export async function getValueAsResource(
// 	valueId: DataObject['id']
// ): Promise<Resource> {
// 	const [firstObject] = await prisma.dataObject.findUnique({
// 		where: {
// 			id: valueId,
// 		},
// 		include: {
// 			values: {
// 				include: {
// 					valueDataObject: true,
// 				},
// 			},
// 		},
// 		take: 1,
// 	});

// 	invariant(firstObject, 'DataObject has no remote');

// 	return await dataObjectToResource(firstObject);
// }

export function composeResourceBase<ForcedType extends ResourceType>(
	dataObject: CompleteDataObject
): Resource & { type: ForcedType } {
	let resource = {
		id: dataObject.id,
		title: dataObject.title,
		type: stringToResourceType(dataObject.type) as ForcedType,
		thumbnail: dataObject.thumbnail,
		// api: stringToSourceType('local' /*api */) as ForcedSource,
		values: {},
	};

	// TODO: check if types actually match and this works?

	return resource;
}

export async function dataObjectToResource(
	dataObject: CompleteDataObject
): Promise<Resource> {
	const values = valueListToMap(dataObject.values);

	switch (dataObject.type) {
		case ResourceType.ALBUM:
			return await dataObjectToAlbum(dataObject, values);
		case ResourceType.ARTIST:
			return await dataObjectToArtist(dataObject, values);
		case ResourceType.SONG:
			return await dataObjectToSong(dataObject, values);
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
