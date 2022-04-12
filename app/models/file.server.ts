import { prisma } from '~/db.server';
import * as fs from '~/fs.server';
import path from 'path';
import mime from 'mime-types';
import type { FileReference } from '@prisma/client';

export function uniqueFilename(
	id: FileReference['id'],
	mimeType: FileReference['mimeType']
) {
	return `${id}.${mime.extension(mimeType)}`;
}

export function getFile(id: FileReference['id']) {
	return prisma.fileReference.findUnique({
		where: {
			id,
		},
	});
}

export function getFileUrl(id: FileReference['id']) {
	return `/media/${id}`;
}

export function getContentType(fileRef: FileReference) {
	return mime.contentType(fileRef.mimeType);
}

export function getFilePath(fileRef: FileReference) {
	const filename = uniqueFilename(fileRef.id, fileRef.mimeType);
	const filepath = path.join(
		process.env.STORAGE_PATH || process.cwd() + '/storage',
		filename
	);

	return filepath;
}

export async function saveFile(filename: string, content: Buffer) {
	const mimeType = mime.lookup(filename) || 'application/octet-stream';

	const fileRef = await prisma.fileReference.create({
		data: {
			mimeType: mimeType,
		},
	});

	const newFilename = uniqueFilename(fileRef.id, mimeType);
	const filepath = path.join(
		process.env.STORAGE_PATH || process.cwd() + '/storage',
		newFilename
	);
	await fs.writeFile(filepath, content);

	return fileRef;
}
