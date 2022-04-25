import {
	DataObject,
	DataObjectRemote,
	DataObjectValue,
	FileReference,
	ValueArrayItem,
} from '@prisma/client';

import { dataObjectToArtist } from '~/adapters/artist/adapter.server';
import {
	dataObjectToAlbum,
	getAlbumDetails,
} from '~/adapters/album/adapter.server';
import { dataObjectToSong } from '~/adapters/song/adapter.server';

// export * from '~/models/resource/adapters/types';

import {
	Album,
	RawValue,
	Resource,
	ResourceDetails,
	ResourceRemotes,
	ResourceType,
	Song,
	stringToResourceType,
	stringToSourceType,
	ValueRef,
} from '~/models/resource/types';
import invariant from 'tiny-invariant';

export type CompleteDataObjectValue = DataObjectValue & {
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
export type DataObjectValueMap = { [key: string]: CompleteDataObjectValue };

/**
 * Convert a DataObject to a resource.
 *
 * @param dataObject The data object to convert
 */
export function dataObjectToResource(dataObject: CompleteDataObject): Resource {
	const values = valuesToObject(dataObject.values);

	switch (dataObject.type) {
		case ResourceType.ALBUM:
			return dataObjectToAlbum(dataObject, values);
		case ResourceType.ARTIST:
			return dataObjectToArtist(dataObject, values);
		case ResourceType.SONG:
			return dataObjectToSong(dataObject, values);
		default:
			throw new Error(`Unknown resource type ${dataObject.type}`);
	}
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
		case ResourceType.ALBUM:
			return getAlbumDetails(resource as Album);

		default:
			return {};
	}
}

/**
 * Convert a DataObjectValue array to a map.
 * @param values The value array
 */
export function valuesToObject(
	values: CompleteDataObjectValue[]
): DataObjectValueMap {
	let object: DataObjectValueMap = {};

	for (const value of values) {
		object[value.key] = value;
	}

	return object;
}

/**
 * Compose the most basic form of a Resource.
 *
 * This function will be called by custom resource adapters.
 */
export function composeResourceBase<ForcedType extends ResourceType>(
	dataObject: CompleteDataObject
): Resource & { type: ForcedType } {
	let remotes: ResourceRemotes = {};

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
type RefReturn<T, R extends Resource> = RawValue<T> | ValueRef<T, R> | null;

/**
 * Compose a RawValue or ValueRef from a DataObjectValue.
 *
 * The function accepts null / undefined as value and will then return null.
 * This is for easier usage when deserializing resources.
 *
 * The generic types here are a bit special.
 * Basically, there are 3 possible cases.
 * 		1. 	No generics are passed
 * 				We assume that the value is a string and references use the plain Resource type.
 * 		2.  A raw value type other than string is passed. (e.g. number)
 * 				Then, a parser function is now required.
 * 		3.  A raw value type and a Resource type is passed.
 * 				A parser function is required, and the linked resource is cast as the resource type.
 *
 * @param value The DataObjectValue to convert from
 */
export function composeRefFromValue(
	value: CompleteDataObjectValue | undefined,
	parser?: Parser<string>
): RefReturn<string, Resource>;
export function composeRefFromValue<
	T extends string,
	R extends Resource = Resource
>(
	value: CompleteDataObjectValue | undefined,
	parser?: Parser<T>
): RefReturn<T, R>;
export function composeRefFromValue<T, R extends Resource = Resource>(
	value: CompleteDataObjectValue | undefined,
	parser: Parser<T>
): RefReturn<T, R>;
export function composeRefFromValue<T, R extends Resource = Resource>(
	value: CompleteDataObjectValue | undefined,
	parser?: Parser<T>
): RefReturn<T, R> {
	return value
		? ({
				ref: value.valueDataObjectId,
				value: parser ? parser(value.value) : value.value,
		  } as RefReturn<T, R>)
		: null;
}

/**
 * Compose a RawValue or ValueRef array from a DataObjectValue.
 *
 * @param value The DataObjectValue to convert from
 */
export function composeRefArrayFromValue<
	ValueType extends any = string,
	TResource extends Resource = Resource
>(
	value?: CompleteDataObjectValue
): RawValue<ValueType>[] | ValueRef<ValueType, TResource>[] {
	if (!value) return [];

	invariant(value.isArray, 'value is not an array');

	return value.items.map((item) => {
		return {
			ref: item.valueDataObjectId,
			value: item.value,
		} as ValueRef<ValueType, TResource>;
	});
}

/**
 * Compose a ValueRef from a resource.
 *
 * The function accepts null / undefined as value and will then return null.
 * This is for easier usage when serializing resources.
 *
 * @param resource The Resource to convert from
 */
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
