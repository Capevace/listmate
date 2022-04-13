import { prisma } from '~/db.server';
import type { SourceType } from '~/models/resource/resource.server';
import { User } from '~/models/user.server';

export type { SourceToken } from '@prisma/client';

export function createToken(userId: User['id'], api: SourceType) {
	return prisma.sourceToken.create({
		data: {
			userId: userId,
			api,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		},
	});
}

export function updateTokenData(
	userId: string,
	api: SourceType,
	data: object,
	expiresAt: Date | null
) {
	return prisma.sourceToken.update({
		where: {
			api_userId: {
				api,
				userId,
			},
		},
		data: {
			data: JSON.stringify(data),
			expiresAt: expiresAt,
		},
	});
}

export function findToken(userId: string, api: SourceType) {
	return prisma.sourceToken.findUnique({
		where: {
			api_userId: {
				api,
				userId,
			},
		},
	});
}

export function findTokens(userId: string) {
	return prisma.sourceToken.findMany({
		where: {
			userId,
		},
	});
}

export function invalidateToken(userId: string, api: SourceType) {
	return prisma.sourceToken.delete({
		where: {
			api_userId: {
				api,
				userId,
			},
		},
	});
}
