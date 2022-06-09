import { deserialize } from '@deepkit/type';
import type {
	DataObject,
	DataObjectRemote,
	DataObjectValue,
	FileReference,
	ValueArrayItem,
} from '@prisma/client';
import invariant from 'tiny-invariant';
import { getAlbumDetails } from '~/adapters/album/adapter.server';
import { getArtistDetails } from '~/adapters/artist/adapter.server';
import type { Artist } from '~/adapters/artist/type';
import { getChannelDetails } from '~/adapters/channel/adapter.server';
import type { Channel } from '~/adapters/channel/type';
import { getCollectionDetails } from '~/adapters/collection/adapter.server';
import { getDetails as getPlaylistDetails } from '~/adapters/playlist/adapter.server';
import { getSongDetails } from '~/adapters/song/adapter.server';
import { getVideoDetails } from '~/adapters/video/adapter.server';
import type { Video } from '~/adapters/video/type';
// export * from '~/models/resource/adapters/types';
import {
	Album,
	Collection,
	Playlist,
	Resource,
	ResourceDetails,
	Remotes,
	Song,
	ValueType,
} from '~/models/resource/types';
import {
	ResourceType,
	stringToResourceType,
	stringToSourceType,
	stringToValueType,
} from '~/models/resource/types';
import { AnyData, Data, ListData } from './refs';

export type CompleteDataObjectValue = DataObjectValue & {
	valueDataObject: DataObject | null;
	items: ValueArrayItem[];
};

/**
 * A DataObject will all required properties to be a valid Resource.
 */
export type CompleteDataObject = DataObject & {
	remotes: DataObjectRemote[];
	values: CompleteDataObjectValue[];
	thumbnail: FileReference | null;
};

/**
 * Map of DataObjectValue.
 */
export type DataObjectValueMap<TResource extends Resource> = {
	[key in keyof TResource['values']]: CompleteDataObjectValue;
};

export function dataObjectValueToData<T extends Data<any> | ListData<any>>(
	dataObjectValue: CompleteDataObjectValue
): T {
	const ref = dataObjectValue.valueDataObject
		? {
				id: dataObjectValue.valueDataObjectId,
				key: 'title', // TODO: Add support for other keys in DB schema
		  }
		: null;

	if (dataObjectValue.type === ValueType.LIST) {
		return deserialize<T>({
			type: dataObjectValue.type,
			items: dataObjectValue.items.map((valueArrayItem) => ({
				type: valueArrayItem.type,
				value: valueArrayItem.value,
				ref: null,
			})),
			ref,
		});
	} else {
		return deserialize<T>({
			type: dataObjectValue.type,
			value: dataObjectValue.value,
			ref,
		});
	}
}

/**
 * Convert a DataObject to a resource.
 *
 * @param dataObject The data object to convert
 */
export function dataObjectToResource<TResource extends Resource>(
	dataObject: CompleteDataObject
): Resource {
	let values: Record<string, AnyData> = {};

	for (const value of dataObject.values) {
		const data = dataObjectValueToData(value);
		values[value.key] = data;
	}

	return {
		...composeResourceBase<TResource['type']>(dataObject),
		// additional spotify-specific fields
		values,
	};
}

/**
 * Get additional details for a resource, that are not contained in the actual DataObject.
 *
 * For example, the songs of an album.
 *
 * @param resource The resource to find additional details for
 */
export async function getResourceDetails(
	resource: Resource
): Promise<ResourceDetails> {
	switch (resource.type) {
		case ResourceType.COLLECTION:
			return getCollectionDetails(resource as Collection);
		case ResourceType.PLAYLIST:
			return getPlaylistDetails(resource as Playlist);
		case ResourceType.ALBUM:
			return getAlbumDetails(resource as Album);
		case ResourceType.ARTIST:
			return getArtistDetails(resource as Artist);
		case ResourceType.SONG:
			return getSongDetails(resource as Song);

		case ResourceType.VIDEO:
			return getVideoDetails(resource as Video);
		case ResourceType.CHANNEL:
			return getChannelDetails(resource as Channel);

		default:
			throw new Error(
				`getResourceDetails: resource type ${resource.type} not implemented`
			);
	}
}

/**
 * Detail function placeholder.
 */
export function getEmptyDetails(_resource: Resource): ResourceDetails {
	return {};
}

/**
 * Convert a DataObjectValue array to a map.
 * @param values The value array
 */
export function valuesToObject<TResource extends Resource>(
	values: CompleteDataObjectValue[]
): DataObjectValueMap<TResource> {
	let object: Partial<DataObjectValueMap<TResource>> = {};

	for (const value of values) {
		object[value.key as keyof TResource['values']] = value;
	}

	return object as DataObjectValueMap<TResource>;
}

/**
 * Compose the most basic form of a Resource.
 *
 * This function will be called by custom resource adapters.
 */
export function composeResourceBase<ForcedType extends ResourceType>(
	dataObject: CompleteDataObject
): Resource & { type: ForcedType } {
	let remotes: Remotes = {};

	for (const remote of dataObject.remotes) {
		const sourceType = stringToSourceType(remote.api);
		remotes[sourceType] = remote.uri;
	}

	let resource: Resource & { type: ForcedType } = {
		id: dataObject.id,
		title: dataObject.title,
		type: stringToResourceType(dataObject.type) as ForcedType,
		thumbnail: dataObject.thumbnail,
		isFavourite: dataObject.isFavourite,
		// api: stringToSourceType('local' /*api */) as ForcedSource,
		values: {},
		remotes,
	};

	// TODO: check if types actually match and this works?

	return resource;
}

type Parser<T> = (v: string) => T;

// /**
//  * Compose a RawValue or ValueRef from a DataObjectValue.
//  *
//  * The function accepts null / undefined as value and will then return null.
//  * This is for easier usage when deserializing resources.
//  *
//  * The generic types here are a bit special.
//  * Basically, there are 3 possible cases.
//  * 		1. 	No generics are passed
//  * 				We assume that the value is a string and references use the plain Resource type.
//  * 		2.  A raw value type other than string is passed. (e.g. number)
//  * 				Then, a parser function is now required.
//  * 		3.  A raw value type and a Resource type is passed.
//  * 				A parser function is required, and the linked resource is cast as the resource type.
//  *
//  * @param value The DataObjectValue to convert from
//  */
// // export function composeRefFromValue(
// // 	value: CompleteDataObjectValue | undefined,
// // 	type?: ValueType,
// // 	parser?: Parser<ValueTypeRawValue<ValueType>>
// // ): RefReturn<ValueType>;
// export function composeRefFromValue<EValueType extends ValueType>(
// 	value: CompleteDataObjectValue | undefined,
// 	type: EValueType,
// 	parser?: Parser<ValueTypeRawValue<EValueType>>
// ): ValueRef<EValueType> | null {
// 	if (!value) {
// 		return null;
// 	}

// 	const dbType = stringToValueType(value.type);

// 	if (dbType !== type) {
// 		throw new Error(
// 			`composeRefFromValue: value type from DB '${dbType}' does not match expected type '${type}'`
// 		);
// 	}

// 	const ref = value.valueDataObjectId;

// 	const parsedValue = parser
// 		? parser(value.value)
// 		: /*value.valueDataObject?.title ?? */ value.value;

// 	return {
// 		ref,
// 		value: parsedValue,
// 		type: type,
// 	} as ValueRef<EValueType>;
// }

// /**
//  * Compose a RawValue or ValueRef array from a DataObjectValue.
//  *
//  * @param value The DataObjectValue to convert from
//  */
// export function composeRefArrayFromValue(
// 	value: CompleteDataObjectValue | undefined
// ): ValueRef<ValueType.RESOURCE>[] {
// 	if (!value) return [];

// 	invariant(value.isArray, 'value is not an array');

// 	return value.items.map((item) => {
// 		return {
// 			ref: item.valueDataObjectId,
// 			value: item.value,
// 			type: ValueType.RESOURCE,
// 		} as ValueRef<ValueType.RESOURCE>;
// 	});
// }
