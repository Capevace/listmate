import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
	const hashedPassword = await bcrypt.hash('123456789', 10);

	const user = await db.user.create({
		data: {
			name: 'Lukas',
			email: 'lukas@mateffy.me',
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});

	const tags = {
		bookmark: await db.tag.create({
			data: {
				name: 'bookmarks',
				description: 'Pocket data',
				createdByUser: false,
			},
		}),
		playlist: await db.tag.create({
			data: {
				name: 'playlist',
				description: 'Playlist data',
				createdByUser: false,
			},
		}),
		pocket: await db.tag.create({
			data: {
				name: 'pocket',
				description: 'Pocket data',
				createdByUser: false,
			},
		}),
		spotify: await db.tag.create({
			data: {
				name: 'spotify',
				description: 'Spotify data',
				createdByUser: false,
			},
		}),
		favouriteSongs: await db.tag.create({
			data: {
				name: 'favourites',
				description: 'Best songs',
				createdByUser: true,
			},
		}),
	};

	const smoothCriminal = await db.listItem.create({
		data: {
			title: 'Smooth Criminal',
			type: 'song', // song, video, file
			remotes: {
				create: [
					{
						type: 'spotify:song',
						remoteId:
							'https://open.spotify.com/track/7CnOzCWGrTINcDExG6u99y?si=fb23039dbb4448f5',
					},
				],
			},
			// tags: [{ create: { tagName: tags.favouriteSongs.name } }],
		},
	});

	const smoothOperator = await db.listItem.create({
		data: {
			title: 'Smooth Operator',
			type: 'song', // song, video, file
			remotes: {
				create: [
					{
						type: 'spotify:song',
						remoteId:
							'https://open.spotify.com/track/7CnOzCWGrTINcDExG6u99y?si=fb23039dbb4448f5',
					},
				],
			},
			// tags: [{ create: { tagName: tags.favouriteSongs.name } }],
		},
	});

	const exampleBookmark = await db.listItem.create({
		data: {
			title: 'Text Rendering Hates You',
			type: 'bookmark', // song, video, file
			remotes: {
				create: {
					type: 'pocket:bookmark',
					remoteId: '34598034',
					// uri: 'https://gankra.github.io/blah/text-hates-you/',
				},
			},
		},
	});

	const spotifyList = await db.list.create({
		data: {
			title: 'elegant kush puffen',
			description: 'für die brennende lunte im mund',
			tags: {
				create: [
					{
						tagName: tags.playlist.name,
					},
					{
						tagName: tags.spotify.name,
					},
				],
			},
			items: {
				create: [
					{
						listItemId: smoothCriminal.id,
					},
					{
						listItemId: smoothOperator.id,
					},
				],
			},
		},
	});

	const pocketList = await db.list.create({
		data: {
			title: 'Pocket bookmarks',
			description: 'Synchronized Pocket bookmarks',
			items: {
				create: [
					{
						listItemId: exampleBookmark.id,
					},
				],
			},
		},
	});
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
