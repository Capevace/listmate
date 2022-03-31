import type { User, List, ListItem, ListItemRemote } from '@prisma/client';

import { prisma } from '~/db.server';
import { Resource } from './resource/base/resource';

export type { ListItem } from '@prisma/client';

export type ListItemData = {
	id: string;
	listId: string;
	resource: Resource;
	position: number;
};

export async function getListItemsForList({
	id,
}: Pick<List, 'id'>): Promise<ListItemData[]> {
	const items = await prisma.listItem.findMany({
		where: { listId: id },
		include: {
			remote: {
				include: {
					values: true,
				},
			},
		},
	});

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
