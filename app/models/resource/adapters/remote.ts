import { DataObjectValue } from '@prisma/client';
import {
	dataObjectToAlbum,
	dataObjectToArtist,
	dataObjectToSong,
} from '../base/music';
import {
	CompleteDataObjectRemote,
	Resource,
	ResourceType,
} from '../base/resource';

export type ValueMap = Map<string, any>;

export function valueListToMap(values: DataObjectValue[]): ValueMap {
	let object: ValueMap = new Map<string, any>();

	for (const value of values) {
		object.set(value.key, value.valueDataObjectId);
	}

	return object;
}

export function remoteToResource(remote: CompleteDataObjectRemote): Resource {
	const values = valueListToMap(remote.values);

	switch (remote.dataObject.type) {
		case ResourceType.ALBUM:
			return dataObjectToAlbum(remote, values);
		case ResourceType.ARTIST:
			return dataObjectToArtist(remote, values);
		case ResourceType.SONG:
			return dataObjectToSong(remote, values);
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
