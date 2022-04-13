import type { List, DataObjectRemote } from '@prisma/client';

import { prisma } from '~/db.server';
import { dataObjectToResource } from '~/models/resource/adapters/adapters.server';
import { Resource } from '~/models/resource/resource.server';

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
async function getRawItemsInList(listId: List['id']) {
	return await prisma.listItem.findMany({
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

export async function getItemsForList({
	id,
}: Pick<List, 'id'>): Promise<ListItemData<Resource>[]> {
	const rawItems = await getRawItemsInList(id);
	let items: ListItemData<Resource>[] = [];

	// TODO: performance could suffer because every conversion is done waited for
	for (const listItem of rawItems) {
		items.push({
			...listItem,
			resource: await dataObjectToResource(listItem.dataObject),
		});
	}

	return items;
}
