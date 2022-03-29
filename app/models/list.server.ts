import type { User, List } from '@prisma/client';

import { prisma } from '~/db.server';

export type { List } from '@prisma/client';

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

export function createList({
	title,
	userId,
}: Pick<List, 'title' | 'userId'> & {
	userId: User['id'];
}) {
	return prisma.list.create({
		data: {
			title,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteList({
	id,
	userId,
}: Pick<List, 'id'> & { userId: User['id'] }) {
	return prisma.list.deleteMany({
		where: { id, userId },
	});
}

export function addListItemToList({
	id,
	userId,
}: Pick<List, 'id'> & { userId: User['id'] }) {
	return prisma.list.deleteMany({
		where: { id, userId },
	});
}
