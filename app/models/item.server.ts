import type { List, DataObjectRemote } from '@prisma/client';
import type { Resource } from '~/models/resource/resource.types';

import { prisma } from '~/db.server';
import { dataObjectToResource } from '~/models/resource/adapters/adapters.server';
import paginate, { PaginateResult } from '~/utilities/paginate';

export type { ListItem } from '@prisma/client';

export type ListItemData<ResourceKind extends Resource = Resource> = {
	id: string;
	listId: string;
	resource: ResourceKind;
	position: number;
};

/**
 * Return all ListItems for a given list (DOES NOT convert output to using Resource types, just uses literal DB types).
 *
 * Includes the linked DataListRemotes and their DataListValues.
 *
 * @private
 */
function getRawItemsInList(listId: List['id'], options?: ListItemOptions) {
	// We make skip and take undefined if no page is passed, so
	// that the query is not paginated in that case!
	const { skip, take }: PaginateResult = options?.page
		? paginate(options?.page)
		: {};

	return prisma.listItem.findMany({
		where: { listId },
		include: {
			dataObject: {
				include: {
					remotes: true,
					thumbnail: true,
					values: true,
				},
			},
		},
		skip,
		take,
	});
}

/**
 * Add a new item to a list
 *
 * If position is set, the item will be inserted at that position.
 * The position value of other items behind the new item will be updated.
 */
export async function addResourceToList(
	listId: List['id'],
	resourceId: DataObjectRemote['id'],
	position?: number
) {
	if (position) {
		const items = await getRawItemsInList(listId);

		for (const item of items) {
			if (item.position >= position) {
				await prisma.listItem.update({
					where: { id: item.id },
					data: { position: item.position + 1 },
				});
			}
		}
	} else {
		position = await prisma.listItem.count({
			where: { listId },
		});
	}

	return await prisma.listItem.create({
		data: {
			list: {
				connect: {
					id: listId,
				},
			},
			dataObject: {
				connect: {
					id: resourceId,
				},
			},
			position,
		},
	});
}

type ListItemOptions = {
	page?: number;
};

export async function getItemsForList(
	{ id }: Pick<List, 'id'>,
	options?: ListItemOptions
): Promise<ListItemData<Resource>[]> {
	const rawItems = await getRawItemsInList(id, options);

	let items: ListItemData<Resource>[] = await Promise.all(
		rawItems.map(async (item) => ({
			...item,
			resource: await dataObjectToResource(item.dataObject),
		}))
	);

	return items;
}
