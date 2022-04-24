import { Except, SetOptional } from 'type-fest';

export * from './group-type';

// Adapter Types
export * from '~/adapters/album/type';
export * from '~/adapters/artist/type';
export * from '~/adapters/song/type';

/**
 * Resource's are used as an abstraction for data objects.
 *
 * This way, the internal data structure is not directly exposed to the client,
 * and we have some more flexibility without having to change implementations.
 */
export type Resource = {
	id: string;
	title: string; // always available string, most basic representation of item
	type: ResourceType;
	isFavourite: boolean;
	values: ResourceValues;
	thumbnail: ResourceFile | null;
};

/**
 * This type of Resource makes certain properties optional.
 * Functions can use this to provide default values for some properties.
 */
export type ResourceWithoutDefaults = SetOptional<
	Except<Resource, 'id'>,
	'isFavourite' | 'thumbnail'
>;

/**
 * ResourceType expresses what kind of resource it is.
 *
 * This is important to include the correct values in a performant manner.
 */
export enum ResourceType {
	BOOKMARK = 'bookmark',
	SONG = 'song',
	ARTIST = 'artist',
	ALBUM = 'album',
	PLAYLIST = 'playlist',
}

/**
 * A list of all resource types.
 */
export const ALL_RESOURCE_TYPES = [
	'bookmark',
	'song',
	'artist',
	'album',
	'playlist',
];

/**
 * Convert a string to a ResourceType.
 *
 * @param type The type to convert
 */
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

/**
 * Convert a string to a ResourceType, returning null if the string is invalid instead of throwing an error.
 */
export function stringToResourceTypeOptional(
	type: string
): ResourceType | null {
	try {
		return stringToResourceType(type);
	} catch {
		return null;
	}
}

/**
 * Type of external data source.
 *
 * Important to identify the correct external API to use with a given URI.
 */
export enum SourceType {
	LOCAL = 'local',
	SPOTIFY = 'spotify',
	YOUTUBE = 'youtube',
	SOUNDCLOUD = 'soundcloud',
	POCKET = 'pocket',
}

/**
 * A list of all source types.
 */
export const ALL_SOURCE_TYPES = [
	'local',
	'spotify',
	'youtube',
	'soundcloud',
	'pocket',
];

/**
 * Convert a string to a SourceType.
 *
 * @param type The type to convert
 */
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

/**
 * The type of the values property on a Resource.
 *
 * It is a map of key to corresponding ValueRef.
 */
export type ResourceValues = { [key: string]: ValueRef<any> | null };

/**
 * ValueRef's are the representation for DataObjectValues that link to a DataObject.
 *
 * They are based on RawValues, so always contain a value (most often the DataObject's title).
 * However, they may also contain a reference to another DataObject.
 *
 * Used for: A song's artist / an album's artist.
 */
export type ValueRef<ValueType> = RawValue<ValueType> & {
	ref?: Resource['id'];
	value: ValueType;
};

/**
 * RawValues are the most basic form of ValueRef, in that they do not link to another DataObject,
 * and only contain a value.
 *
 * Used for: A song's name / an bookmarks's url.
 */
export type RawValue<ValueType = string> = {
	value: ValueType;
};

/**
 * Representing a FileReference.
 */
export type ResourceFile = {
	id: string;
	mimeType: string;
	createdAt: Date;
};

/**
 * Force a resource type on the Resource type.
 *
 * Only used for Typescript.
 */
export type ForceResourceType<T extends ResourceType> = Resource & {
	type: T;
};
