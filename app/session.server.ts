import { createSessionStorage, redirect } from 'remix';
import { prisma } from './db.server';

import invariant from 'tiny-invariant';

import type { User } from '~/models/user.server';
import { getUserById } from '~/models/user.server';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = createSessionStorage({
	cookie: {
		name: '',
		httpOnly: true,
		maxAge: 0,
		path: '/',
		sameSite: 'lax',
		secrets: [process.env.SESSION_SECRET + 'aa'],
		secure: process.env.NODE_ENV === 'production',
	},
	async createData(data, expires?: Date) {
		// `expires` is a Date after which the data should be considered
		// invalid. You could use it to invalidate the data somehow or
		// automatically purge this record from your database.
		const session = await prisma.session.create({
			data: {
				expiresAt: expires,
				data: JSON.stringify(data),
			},
		});
		return session.id;
	},
	async readData(id) {
		const session = await prisma.session.findUnique({
			where: { id },
		});

		return session ? JSON.parse(session.data) : null;
	},
	async updateData(id, data, expiresAt) {
		await prisma.session.upsert({
			where: { id },
			update: {
				expiresAt,
				data: JSON.stringify(data),
			},
			create: {
				id,
				expiresAt,
				data: JSON.stringify(data),
			},
		});
	},
	async deleteData(id) {
		await await prisma.session.delete({
			where: { id },
		});
	},
});

const USER_SESSION_KEY = 'userId';

export async function getSession(request: Request) {
	const cookie = request.headers.get('Cookie');
	return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<string | undefined> {
	const session = await getSession(request);
	const userId = session.get(USER_SESSION_KEY);
	return userId;
}

export async function getUser(request: Request): Promise<null | User> {
	const userId = await getUserId(request);
	if (userId === undefined) return null;

	const user = await getUserById(userId);
	if (user) return user;

	throw await logout(request);
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
): Promise<string> {
	const userId = await getUserId(request);
	if (!userId) {
		const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
}

export async function requireUser(request: Request) {
	const userId = await requireUserId(request);

	const user = await getUserById(userId);
	if (user) return user;

	throw await logout(request);
}

export async function createUserSession({
	request,
	userId,
	remember,
	redirectTo,
}: {
	request: Request;
	userId: string;
	remember: boolean;
	redirectTo: string;
}) {
	const session = await getSession(request);
	session.set(USER_SESSION_KEY, userId);
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session, {
				maxAge: remember
					? 60 * 60 * 24 * 7 // 7 days
					: undefined,
			}),
		},
	});
}

export async function logout(request: Request) {
	const session = await getSession(request);
	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
