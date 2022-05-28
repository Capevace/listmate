import type {
	Prisma,
	DataObject,
	DataObjectRemote,
	FileReference,
} from '@prisma/client';
import type { Except, MergeExclusive } from 'type-fest';
import {
	Resource,
	ResourceType,
	ResourceWithoutDefaults,
	SourceType,
	ValueType,
} from '~/models/resource/types';

import invariant from 'tiny-invariant';
import { prisma as db } from '~/db.server';
import { dataObjectToResource } from './adapters.server';
import { serialize } from './serialize';

//
// READ
//

/**
 * Search for resources that contain the given text
 *
 * @param text The text to search for
 */
export async function searchResources(text: string): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			OR: [
				{ title: { contains: text } },
				{ values: { some: { value: { contains: text } } } },
			],
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

/**
 * Find a resource by a given Resource / DataObject ID.
 *
 * @param resourceId The resource ID to find
 * @returns Promise<Resource>
 */
export async function findResourceById(
	id: Resource['id']
): Promise<Resource | null> {
	const dataObject = await db.dataObject.findUnique({
		where: {
			id,
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObject ? dataObjectToResource(dataObject) : null;
}

/**
 * Find a Resource by an associated remote URI.
 *
 * For example you could pass SourceType.SPOTIFY
 * and "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" to
 * find the associated track in the Spotify API.
 * @param api The type of the remote URI
 * @param uri The remote URI to find
 * @returns
 */
export async function findResourceByRemoteUri(
	api: SourceType,
	uri: DataObjectRemote['uri']
): Promise<Resource | null> {
	const remote = await db.dataObjectRemote.findUnique({
		where: {
			api_uri: {
				api,
				uri,
			},
		},
	});

	if (!remote) return null;

	return findResourceById(remote.dataObjectId);
}

/**
 * Find multiple Resource by their type.
 *
 * @param type The type of the Resource
 */
export async function findResourcesByType(
	type: ResourceType
): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			type,
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

/**
 * Find multiple Resource by their type, with multiple being possible.
 *
 * @param types The valid types
 */
export async function findResourcesByTypes(
	types: ResourceType[]
): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			type: {
				in: types,
			},
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

/**
 * Find multiple Resource by their value.
 *
 * @param type The type of the Resource
 */
export async function findResourcesByValue(
	key: string,
	value: string
): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			values: {
				some: {
					key,
					value: {
						contains: value ?? '',
					},
				},
			},
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

/**
 * Find multiple Resource by their value reference.
 *
 * For example, you can find all songs that have a reference to a specific artist or album.
 *
 * @param type The type of the Resource
 */
export async function findResourcesByValueRef(
	key: string,
	ref: string
): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			values: {
				some: {
					key,
					valueDataObjectId: ref,
				},
			},
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

/**
 * Find multiple Resource by their value reference.
 *
 * For example, you can find all songs that have a reference to a specific artist or album.
 *
 * @param type The type of the Resource
 */
export async function resolveValueRefArray(
	resourceId: Resource['id'],
	key: string
): Promise<Resource[]> {
	const arrayItems = await db.valueArrayItem.findMany({
		where: {
			parentDataObjectId: resourceId,
			parentKey: key,
			valueDataObjectId: {
				not: null,
			},
		},
		include: {
			valueDataObject: {
				include: {
					remotes: true,
					values: {
						include: {
							valueDataObject: true,
							items: true,
						},
					},
					thumbnail: true,
				},
			},
		},
	});

	return arrayItems
		.filter((item) => item.valueDataObject !== null)
		.sort((a, b) => a.position - b.position)
		.map((arrayItem) => {
			invariant(
				arrayItem.valueDataObject !== null,
				'valueDataObject should not be null, as per query'
			);

			return dataObjectToResource(arrayItem.valueDataObject);
		});
}

type ResourceQuery = {
	id: Resource['id'];
	type: ResourceType;
	value: {
		key: string;
		value: string;
	};
	valueRef: {
		key: string;
		ref: string;
	};
	valueArrayRef: {
		key: string;
		ref: string;
	};
};
type ObjectKeys<T> = T extends object
	? (keyof T)[]
	: T extends number
	? []
	: T extends Array<any> | string
	? string[]
	: never;

export async function findResources(
	query: Partial<ResourceQuery>,
	comparator: 'AND' | 'OR' = 'AND'
): Promise<Resource[]> {
	const dataObjects = await db.dataObject.findMany({
		where: {
			// AND: [{ type: query.type }],
			[comparator]: (Object.keys(query) as ObjectKeys<ResourceQuery>)
				.map((key) => {
					const value = query[key];

					if (!value) return null;

					switch (key) {
						case 'id':
							return { id: value };
						case 'type':
							return { type: value };
						case 'value':
							const { key: valueRefKey, value: valueRefValue } =
								value as ResourceQuery['value'];

							return {
								values: {
									some: {
										key: valueRefKey,
										value: {
											contains: valueRefValue,
										},
									},
								},
							};
						case 'valueRef':
							const { key: refKey, ref } = value as ResourceQuery['valueRef'];

							return {
								values: {
									some: {
										key: refKey,
										valueDataObjectId: ref,
									},
								},
							};
						default:
							return null;
					}
				})
				.filter((predicate) => predicate !== null),
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	return dataObjects.map(dataObjectToResource);
}

export type PageSlice = {
	page: number;
	max: number;
};

export type OffsetSlice = {
	take: number;
	skip: number;
};

export enum FilterOperator {
	Equals = 'equals',
	Not = 'not',
	In = 'in',
	NotIn = 'notIn',
	GreaterThan = 'gt',
	GreaterThanOrEquals = 'gte',
	LessThan = 'lt',
	LessThanOrEquals = 'lte',
	Contains = 'contains',
	StartsWith = 'startsWith',
	EndsWith = 'endsWith',
}

export type QueryFilter<
	TResource extends Resource,
	Type = 'any' | 'main' | 'value'
> = (Type extends 'any'
	? MergeExclusive<
			{ valueKey: keyof TResource['values'] },
			{ key: keyof TResource }
	  >
	: Type extends 'main'
	? { key: keyof TResource }
	: { valueKey: keyof TResource['values'] }) & {
	operator: FilterOperator;
	needle: string;
};

export enum SortDirection {
	Ascending = 'asc',
	Descending = 'desc',
}

export type QuerySort = {
	key: string;
	order: SortDirection;
};

export type PaginateQuery<TResource extends Resource> = {
	slice: PageSlice | OffsetSlice;
	filterBy?: QueryFilter<TResource, 'any'>[];
	orderBy?: QuerySort;
};

export type PaginatedResources = {
	slice: PageSlice;
	resources: Resource[];
};

export async function paginateResources<TResource extends Resource>(
	query: PaginateQuery<TResource>
): Promise<PaginatedResources> {
	const { take, skip } =
		'page' in query.slice
			? { take: query.slice.max, skip: query.slice.page * query.slice.max }
			: query.slice;

	const filters: Prisma.Enumerable<Prisma.DataObjectWhereInput> =
		query.filterBy?.map((filter) => {
			if (filter.valueKey) {
				// Filter is Resource values
				return {
					values: {
						every: {
							[filter.valueKey]: {
								[filter.operator]: filter.needle,
							},
						},
					},
				};
			} else if (filter.key) {
				return {
					[filter.key]: {
						[filter.operator]: filter.needle,
					},
				};
			} else {
				throw new Error('QueryFilters need to include a key or valueKey');
			}
		}) ?? [];

	const dataObjects = await db.dataObject.findMany({
		where: {
			AND: filters,
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
		orderBy: query.orderBy
			? {
					values: {
						[query.orderBy.key]: query.orderBy.order,
					},
			  }
			: { title: SortDirection.Descending },
		take,
		skip,
	});

	return {
		slice: {
			page: Math.ceil(skip / take),
			max: take,
		},
		resources: dataObjects.map(dataObjectToResource),
	};
}

//##
// Create Resources \\
//####

/**
 * Create a new Resource / DataObject.
 *
 * The ID property can be omitted from the resource,
 * and will be generated by the database.
 *
 * @param resource The resource to create
 * @returns Promise<Resource>
 */
export async function createResource(
	customResource: ResourceWithoutDefaults
): Promise<Resource> {
	const resource: Except<Resource, 'id'> = {
		isFavourite: false,
		thumbnail: null,
		...customResource,
	};

	const dataObject = await db.dataObject.create({
		data: {
			title: resource.title,
			type: resource.type,
			thumbnailFileId: resource.thumbnail?.id || null,
			isFavourite: resource.isFavourite,
			remotes: {
				connectOrCreate: Object.entries(resource.remotes).map(([api, uri]) => ({
					where: {
						api_uri: {
							api,
							uri,
						},
					},
					create: {
						api,
						uri,
					},
				})),
			},
		},
	});

	await upsertValues({ ...resource, id: dataObject.id });

	const fullObject = await db.dataObject.findUnique({
		where: {
			id: dataObject.id,
		},
		include: {
			remotes: true,
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	invariant(fullObject, 'Could not create resource');

	return dataObjectToResource(fullObject);
}

//##
// Update Resources \\
//####

/**
 * Create or update a new resource.
 *
 * The resource ID is required, as it is used to identify the resource.
 * @todo Add a method to upsert a resource by its URIs
 *
 * @param resource
 * @returns Promise<Resource>
 */
export async function upsertResource(resource: Resource): Promise<Resource> {
	const dataObject = await db.dataObject.upsert({
		where: {
			id: resource.id,
		},
		// TODO: when used with the if clause below, we can try and find similar dataobjects
		update: {
			title: resource.title,
			type: resource.type,
			isFavourite: resource.isFavourite,
			thumbnailFileId: resource.thumbnail?.id || null,
			remotes: {
				connectOrCreate: Object.entries(resource.remotes).map(([api, uri]) => ({
					where: {
						api_uri: {
							api,
							uri,
						},
					},
					create: {
						api,
						uri,
					},
				})),
				// disconnect: Object.keys(resource.remotes).map(([api]) => ({
				// 	dataObjectId_api: {
				// 		dataObjectId: resource.id,
				// 		api,
				// 	},
				// })),
			},

			// When updating a DataObject, we also need to update the values where they're referenced
			references: {
				updateMany: {
					where: {
						valueDataObjectId: resource.id,
					},
					data: {
						value: resource.title,
					},
				},
			},
			arrayReferences: {
				updateMany: {
					where: {
						valueDataObjectId: resource.id,
					},
					data: {
						value: resource.title,
					},
				},
			},
		},
		create: {
			id: resource.id,
			title: resource.title,
			type: resource.type,
			isFavourite: resource.isFavourite,
			thumbnailFileId: resource.thumbnail?.id || null,
			remotes: {
				connectOrCreate: Object.entries(resource.remotes).map(([api, uri]) => ({
					where: {
						api_uri: {
							api,
							uri,
						},
					},
					create: {
						api,
						uri,
					},
				})),
			},
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
			values: {
				include: {
					valueDataObject: true,
					items: true,
				},
			},
			thumbnail: true,
		},
	});

	invariant(fullObject, 'Could not upsert data object');

	return dataObjectToResource(fullObject);
}

/**
 * Set a resource's values. DataObjectValues will be created or updated accordingly.
 *
 * ValueRef relationships will be properly added to the database.
 *
 * @param resource
 */
export async function upsertValues(
	resource: Resource,
	values?: Partial<Resource['values']>
) {
	for (const [key, valueRefOrArray] of Object.entries(
		values ?? resource.values
	)) {
		// TODO: If valueRefOrArray is null, we want to delete the value if it exists
		if (!valueRefOrArray) continue;

		if (Array.isArray(valueRefOrArray)) {
			const serializedValue = valueRefOrArray
				.map((valueRef) => serialize(valueRef.value, valueRef.type))
				.join(', ');

			await db.dataObjectValue.upsert({
				where: {
					dataObjectId_key: {
						dataObjectId: resource.id,
						key,
					},
				},
				update: {
					isArray: true,
					valueDataObjectId: null,
					type: ValueType.RESOURCE_LIST,
					value: serializedValue,
					items: {
						deleteMany: {},
					},
				},
				create: {
					dataObjectId: resource.id,
					key,
					type: ValueType.RESOURCE_LIST,
					value: serializedValue,
					isArray: true,
				},
			});

			await db.$transaction(
				valueRefOrArray.map((valueRef, index) => {
					const serializedValue = serialize(valueRef.value, valueRef.type);

					return db.valueArrayItem.upsert({
						where: {
							parentDataObjectId_parentKey_position: {
								parentDataObjectId: resource.id,
								parentKey: key,
								position: index,
							},
						},
						update: {
							position: index,

							value: serializedValue,
							valueDataObjectId: valueRef.ref,
						},
						create: {
							parentDataObjectId: resource.id,
							parentKey: key,
							position: index,

							value: serializedValue,
							valueDataObjectId: valueRef.ref,
						},
					});
				})
			);
		} else {
			const serializedValue = serialize(
				valueRefOrArray.value,
				valueRefOrArray.type
			);

			await db.dataObjectValue.upsert({
				where: {
					dataObjectId_key: {
						dataObjectId: resource.id,
						key,
					},
				},
				update: {
					value: serializedValue,
					valueDataObjectId: valueRefOrArray.ref,
					isArray: false,
					type: valueRefOrArray.type,
					items: {
						deleteMany: {
							parentDataObjectId: resource.id,
							parentKey: key,
						},
					},
				},
				create: {
					dataObjectId: resource.id,
					key,
					isArray: false,
					type: valueRefOrArray.type,
					value: serializedValue,
					valueDataObjectId: valueRefOrArray.ref,
				},
			});
		}
	}
}

/**
 * Create or update multiple resources.
 *
 * This should only be used for seeding the DB, as IDs are required.
 * The function call will overwrite existing resources with given IDs.
 *
 * Instead of an array, a map will be returned, with the resource ID as key.
 *
 * @param resourcesToCreate A list of the resources to create or update.
 * @returns Promise<Record<string, Resource>> A map of the created/updated resources.
 */
export async function upsertResources(
	resourcesToCreate: Resource[]
): Promise<Record<string, Resource>> {
	let resources: Record<string, Resource> = {};

	for (const resource of resourcesToCreate) {
		const createdObject = await upsertResource(resource);
		resources[createdObject.id] = createdObject;
	}

	return resources;
}

/**
 * Attach a remote URI to a resource.
 *
 * For example, you can attach a Spotify URI like "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"
 * to a DataObject, and it will be identifiable by the Spotify Import API.
 *
 * @param resourceId The Resource ID to attach the remote URI to
 * @param api The type of the remote URI
 * @param uri The remote URI
 * @returns Promise<DataObjectRemote>
 */
export async function attachRemoteUri(
	resourceId: Resource['id'],
	api: SourceType,
	uri: DataObjectRemote['uri']
): Promise<DataObjectRemote> {
	return db.dataObjectRemote.upsert({
		where: {
			dataObjectId_api: {
				dataObjectId: resourceId,
				api,
			},
		},
		update: {
			uri,
		},
		create: {
			dataObjectId: resourceId,
			api,
			uri,
		},
	});
}

/**
 * Detach a remote URI from a resource.
 *
 * See attachRemoteUri for more information.
 *
 * @param resourceId The Resource ID to attach the remote URI to
 * @param api The type of the remote URI
 */
export async function detachRemoteUri(
	resourceId: Resource['id'],
	api: SourceType
): Promise<void> {
	await db.dataObjectRemote.delete({
		where: {
			dataObjectId_api: {
				dataObjectId: resourceId,
				api,
			},
		},
	});
}

/**
 * Attach a FileReference to a resource as a thumbnail
 *
 * @param resourceId The ID of the Resource to add
 * @param fileRef The FileReference of the thumbnail image
 * @returns Promise<DataObject>
 */
export function attachThumbnailToResource(
	resourceId: string,
	fileRef: FileReference
): Promise<DataObject> {
	return db.dataObject.update({
		where: {
			id: resourceId,
		},
		data: {
			thumbnailFileId: fileRef.id,
		},
	});
}

/**
 * Attach a FileReference to a resource as a thumbnail
 *
 * @param resourceId The ID of the Resource to add
 * @param isFavourite Wether to set the resource as a favourite or not
 * @returns Promise<DataObject>
 */
export async function setFavouriteStatus(
	resourceId: string,
	isFavourite: boolean
): Promise<Resource> {
	return dataObjectToResource(
		await db.dataObject.update({
			where: {
				id: resourceId,
			},
			data: {
				isFavourite,
			},
			include: {
				remotes: true,
				values: {
					include: {
						valueDataObject: true,
						items: true,
					},
				},
				thumbnail: true,
			},
		})
	);
}

//##
// Delete Resources \\
//####

/**
 * Delete a resource
 *
 * @param resourceId The ID of the Resource to delete
 */
export async function deleteResource(resourceId: string): Promise<void> {
	await db.dataObject.delete({
		where: {
			id: resourceId,
		},
	});
}
