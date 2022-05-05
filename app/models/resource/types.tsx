import {
	Spotify as SpotifyIcon,
	Youtube as YoutubeIcon,
} from 'react-bootstrap-icons';
import { Except, SetOptional } from 'type-fest';

export * from './group-type';

// Adapter Types
export * from '~/adapters/collection/type';
export * from '~/adapters/album/type';
export * from '~/adapters/artist/type';
export * from '~/adapters/song/type';
export * from '~/adapters/playlist/type';

/**
 * Resource's are used as an abstraction for data objects.
 *
 * This way, the internal data structure is not directly exposed to the client,
 * and we have some more flexibility without having to change implementations.
 */
export type Resource<
	TResourceType extends ResourceType = ResourceType,
	TValues extends ResourceValues = ResourceValues
> = {
	id: string;
	title: string; // always available string, most basic representation of item
	type: TResourceType;
	isFavourite: boolean;

	// somehow, I can't seem to figure out how to type values properly, so its just an object for now.
	// BUT, it can only contain values of the following signature: RawValue<T> | ValueRef<T, R> | ValueRef<T, R>[]
	values: TValues;

	thumbnail: ResourceFile | null;
	remotes: ResourceRemotes;
};

/**
 * This type of Resource makes certain properties optional.
 * Functions can use this to provide default values for some properties.
 */
export type ResourceWithoutDefaults<TResource extends Resource = Resource> =
	SetOptional<Except<TResource, 'id'>, 'isFavourite' | 'thumbnail'>;

export type ResourceWithSerializedValues<
	TResource extends Resource = Resource
> = Except<ResourceWithoutDefaults<TResource>, 'values'> & {
	values: SerializedValues<TResource['values']>;
};

/**
 * ResourceType expresses what kind of resource it is.
 *
 * This is important to include the correct values in a performant manner.
 */
export enum ResourceType {
	COLLECTION = 'collection',

	BOOKMARK = 'bookmark',

	// Music (Spotify etc)
	PLAYLIST = 'playlist',
	SONG = 'song',
	ARTIST = 'artist',
	ALBUM = 'album',

	// Video (YouTube etc.)
	VIDEO = 'video',
	CHANNEL = 'channel',
}

/**
 * A list of all resource types.
 */
export const ALL_RESOURCE_TYPES: ResourceType[] = [
	ResourceType.COLLECTION,

	ResourceType.BOOKMARK,

	ResourceType.PLAYLIST,
	ResourceType.SONG,
	ResourceType.ARTIST,
	ResourceType.ALBUM,

	ResourceType.VIDEO,
	ResourceType.CHANNEL,
];

/**
 * Convert a string to a ResourceType.
 *
 * @param type The type to convert
 */
export function stringToResourceType(type: string): ResourceType {
	switch (type) {
		case 'collection':
			return ResourceType.COLLECTION;

		case 'bookmark':
			return ResourceType.BOOKMARK;

		case 'playlist':
			return ResourceType.PLAYLIST;
		case 'song':
			return ResourceType.SONG;
		case 'album':
			return ResourceType.ALBUM;
		case 'artist':
			return ResourceType.ARTIST;

		case 'video':
			return ResourceType.VIDEO;
		case 'channel':
			return ResourceType.CHANNEL;

		default:
			throw new Error(`Unknown resource type: ${type}`);
	}
}

/**
 * Convert a string to a ResourceType, returning null if the string is invalid instead of throwing an error.
 */
export function stringToResourceTypeOptional(
	type?: string
): ResourceType | null {
	try {
		return type ? stringToResourceType(type) : null;
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
	SourceType.LOCAL,
	SourceType.SPOTIFY,
	SourceType.YOUTUBE,
	SourceType.SOUNDCLOUD,
	SourceType.POCKET,
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
 * Convert a string to a SourceType, returning null if the string is invalid instead of throwing an error.
 */
export function stringToSourceTypeOptional(type?: string): SourceType | null {
	try {
		return type ? stringToSourceType(type) : null;
	} catch {
		return null;
	}
}

export const SOURCE_ICONS: { [key in SourceType]?: React.ReactNode } = {
	[SourceType.SPOTIFY]: <SpotifyIcon size={'auto'} />,
	[SourceType.YOUTUBE]: <YoutubeIcon size={'auto'} />,
};

export const SOURCE_NAMES: { [key in SourceType]: string } = {
	[SourceType.LOCAL]: 'Local',
	[SourceType.SPOTIFY]: 'Spotify',
	[SourceType.YOUTUBE]: 'YouTube',
	[SourceType.SOUNDCLOUD]: 'Soundcloud',
	[SourceType.POCKET]: 'Pocket',
};

export function sourceTypeToName(type: SourceType): string {
	return SOURCE_NAMES[type] || type;
}

/**
 * The type of the values property on a Resource.
 *
 * It is a map of key to corresponding ValueRef.
 */
export type ResourceValues<EValueType extends ValueType = ValueType> = {
	[key: string]: ValueRef<EValueType> | ValueRef<EValueType>[] | null;
};

/**
 * Complicated type that casts all ValueRef generics to string for a given resource
 */
export type SerializedValues<
	TResourceValues extends ResourceValues = ResourceValues
> = {
	[key in keyof TResourceValues]:
		| SerializedValueRef
		| SerializedValueRef[]
		| null;
};

export type ResourceRemotes = { [key in SourceType]?: string };

/**
 * ValueRef's are the representation for DataObjectValues that link to a DataObject.
 *
 * They are based on RawValues, so always contain a value (most often the DataObject's title).
 * However, they may also contain a reference to another DataObject.
 *
 * Used for: A song's artist / an album's artist.
 */
export type ValueRef<EValueType extends ValueType = ValueType> = {
	value: ValueTypeRawValue<EValueType>;
	type: EValueType;
	ref: ValueRefType<EValueType> | null;
};

// /**
//  * RawValues are the most basic form of ValueRef, in that they do not link to another DataObject,
//  * and only contain a value.
//  *
//  * Used for: A song's name / an bookmarks's url.
//  */
// export type RawValue<EValueType extends ValueType = ValueType.TEXT> = {
// 	value: ValueTypeRawValue<EValueType>;
// 	type: EValueType;
// };

export type SerializedValueRef = {
	value: string;
	type: ValueType;
	ref?: Resource['id'];
};

export type SerializedResource<TResource extends Resource> = Except<
	TResource,
	'values'
> & {
	values: SerializedValues<TResource['values']>;
};

export enum ValueType {
	TEXT = 'text',
	NUMBER = 'number',

	DATE = 'date',
	URL = 'url',
	SOURCE_TYPE = 'source-type',

	RESOURCE = 'resource',
	RESOURCE_LIST = 'resource-list',
}

export const VALUE_TYPES: { [key in ValueType]: ValueType } = {
	text: ValueType.TEXT,
	number: ValueType.NUMBER,
	date: ValueType.DATE,
	url: ValueType.URL,
	'source-type': ValueType.SOURCE_TYPE,
	resource: ValueType.RESOURCE,
	'resource-list': ValueType.RESOURCE_LIST,
};

export type ValueTypeRawValue<EValueType extends ValueType> =
	EValueType extends ValueType.RESOURCE_LIST
		? Resource['title']
		: EValueType extends ValueType.RESOURCE
		? Resource['title']
		: EValueType extends ValueType.SOURCE_TYPE
		? SourceType
		: EValueType extends ValueType.URL
		? URL
		: EValueType extends ValueType.DATE
		? Date
		: EValueType extends ValueType.NUMBER
		? number
		: string;

export type ValueRefType<EValueType extends ValueType> =
	EValueType extends ValueType.RESOURCE_LIST
		? Resource['id']
		: EValueType extends ValueType.RESOURCE
		? Resource['id']
		: undefined;

/**
 * Convert a string to a SourceType.
 *
 * @param type The type to convert
 */
export function stringToValueType(type: string): ValueType {
	const valueType = VALUE_TYPES[type as ValueType];

	if (!valueType) {
		throw new Error(`Unknown value type: ${type}`);
	}

	return valueType;
}

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

/**
 * Base type for Resource details
 */
export type ResourceDetails = {};

/**
 * Base type for DetailViewProps
 */
export type ResourceDetailsProps<
	TResource extends Resource = Resource,
	TResourceDetails extends ResourceDetails = ResourceDetails
> = {
	resource: TResource;
	details: TResourceDetails;
};
