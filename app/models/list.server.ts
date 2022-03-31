import type { User, List, DataObjectRemote } from '@prisma/client';
import { SetOptional } from 'type-fest';
import { prisma } from '~/db.server';
import { Resource } from './resource/base/resource';

export type { List } from '@prisma/client';

export type ListData = {
	title: string;
	description?: string;
	userId?: User['id'];

	items: ListItemData[];
};

export function getList({
	id,
}: Pick<List, 'id'> & {
	userId: User['id'];
}) {
	return prisma.list.findFirst({
		where: { id },
	});
}

export function getUserLists({ userId }: { userId: User['id'] }) {
	return prisma.list.findMany({
		where: { userId },
		orderBy: { title: 'desc' },
	});
}

export function upsertList({
	id,
	title,
	description,
	userId,
}: SetOptional<List, 'id'>) {
	const userQuery = userId
		? {
				user: {
					connect: {
						id: userId,
					},
				},
		  }
		: {};

	if (id) {
		return prisma.list.upsert({
			where: { id },
			update: {
				title,
				description,
			},
			create: {
				id,
				title,
				description,
				...userQuery,
			},
		});
	} else {
		return prisma.list.create({
			data: {
				id,
				title,
				description,
				...userQuery,
			},
		});
	}
}

export function deleteList({
	id,
	userId,
}: Pick<List, 'id'> & { userId: User['id'] }) {
	return prisma.list.deleteMany({
		where: { id, userId },
	});
}

export async function itemsInList(listId: List['id']) {
	return await prisma.listItem.findMany({
		where: { listId },
		include: {
			remote: {
				include: {
					values: true,
				},
			},
		},
	});
}

export async function addResourceToList(
	listId: List['id'],
	resourceId: DataObjectRemote['id'],
	position?: number
) {
	if (position) {
		const items = await itemsInList(listId);

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
