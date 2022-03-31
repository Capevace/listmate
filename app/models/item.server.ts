import type { List, DataObjectRemote } from '@prisma/client';

import { prisma } from '~/db.server';
import { remoteToResource } from './resource/adapters/remote';
import { Resource } from './resource/base/resource';

export type { ListItem } from '@prisma/client';

export type ListItemData = {
	id: string;
	listId: string;
	resource: Resource;
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
			remote: {
				include: {
					dataObject: true,
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
			remote: {
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
}: Pick<List, 'id'>): Promise<ListItemData[]> {
	const items = await getRawItemsInList(id);

	return items.map((listItem) => ({
		...listItem,
		resource: remoteToResource(listItem.remote),
	}));
}

// function toUrl(search: string) {
// 	try {
// 		const url = new URL(search);

// 		if (url.protocol === 'http:' || url.protocol === 'https:') {
// 			return url;
// 		}

// 		return null;
// 	} catch (_) {
// 		return null;
// 	}
// }

// async function fetchWebpageMetadata(url: URL) {
// 	return {
// 		title: 'Example title',
// 		snippet: '',
// 	};
// }

// async function createBookmark({ url }: { url: URL }) {
// 	// Fetch metadata from url
// 	const { title, snippet } = await fetchWebpageMetadata(url);

// 	return await prisma.listItem.create({
// 		data: {
// 			title: title,
// 			type: 'bookmark',
// 			remotes: {
// 				create: {
// 					type: 'local:bookmark',
// 					remoteId: url.toString(),
// 					information: JSON.stringify({ snippet }),
// 				},
// 			},
// 		},
// 	});
// }

// function composeSpotifySong(listItem: ListItem, itemRemote: ListItemRemote) {}

// async function createSpotifySong({ id }: { id: string }) {
// 	// Fetch metadata from url
// 	const { title, snippet } = await fetchWebpageMetadata(url);

// 	return await prisma.listItem.create({
// 		data: {
// 			title: title,
// 			type: 'song',
// 			remotes: {
// 				create: {
// 					type: 'spotify:song',
// 					remoteId: id,
// 					information: JSON.stringify({ snippet }),
// 				},
// 			},
// 		},
// 	});
// }

// export async function createFromSearch({ search }: { search: string }) {
// 	const url = toUrl(search);

// 	if (search.startsWith('spotify')) {
// 		return await createBookmark({ url });
// 	} else if (url) {
// 		return await createBookmark({ url });
// 	}
// 	await prisma.listItem.create({
// 		data: {
// 			title: search,
// 			type: 'song',
// 		},
// 	});
// }
