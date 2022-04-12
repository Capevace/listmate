import type { User, List } from '@prisma/client';
import { SetOptional } from 'type-fest';
import { prisma } from '~/db.server';
import { ListItemData } from './item.server';

export type { List } from '@prisma/client';

export type ListData = {
	title: string;
	description?: string;
	userId?: User['id'];

	items: ListItemData[];
};

/**
 * Get a list by id
 */
export async function getList({ id }: Pick<List, 'id'>) {
	return prisma.list.findFirst({
		where: { id },
	});
}

/**
 * Get all lists for a given user.
 */
export async function getListsForUser({ id }: Pick<User, 'id'>) {
	return await prisma.list.findMany({
		where: { userId: id },
		orderBy: { title: 'desc' },
	});
}

/**
 * Create or update a list.
 *
 * Passing a userId will connect the new list to that user.
 */
export async function upsertList({
	id,
	title,
	description,
	userId,
	coverFileReferenceId,
}: SetOptional<List, 'id' | 'coverFileReferenceId'>) {
	if (id) {
		return await prisma.list.upsert({
			where: { id },
			update: {
				title,
				description,
			},
			create: {
				id,
				title,
				description,
				coverFileReferenceId,
				userId: userId ?? undefined,
			},
		});
	} else {
		return await prisma.list.create({
			data: {
				id,
				title,
				description,
				userId: userId ?? undefined,
			},
		});
	}
}

/**
 * Delete a list
 */
export async function deleteList({
	id,
}: Pick<List, 'id'> & { userId: User['id'] }) {
	return await prisma.list.delete({
		where: { id },
	});
}

// Items
