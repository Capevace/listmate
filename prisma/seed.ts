import { List, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addResourceToList } from '~/models/item.server';
import { upsertList } from '~/models/list.server';

import type {
	Album,
	Artist,
	Song,
	// SpotifyAlbum,
	// SpotifyResource,
} from '~/models/resource/base/music';
import {
	ResourceType,
	SourceType,
	createResources,
} from '~/models/resource/base/resource';

const db = new PrismaClient();

// Object.keys(resource)
// 	.filter((key) => !resourceValueBlacklist.includes(key))
// 	.map((key) => {
// 		const value = valueLookup[key];
// 		// If it is a resource
// 		// TODO: stronger type protection here
// 		if (typeof value === 'object' && 'id' in value) {
// 			const resource = value as Resource;
// 			return {
// 				create: {
// 					key: key,
// 					value: resource.title,
// 					dataObjectId: resource.id,
// 				},
// 				where: {
// 					remoteId_key: {
// 						key: key,
// 					},
// 				},
// 			};
// 		} else {
// 			return {
// 				create: {
// 					key: key,
// 					value: String(value),
// 				},
// 				where: {
// 					remoteId_key: {
// 						key: key,
// 					},
// 				},
// 			};
// 		}
// 	}),

async function createAlbumSongs(songs: string[], album: Album) {
	const songsToCreate: Song[] = songs.map((songName) => ({
		id: `TEST-${songName.replace(/\s/g, '-')}`,
		foreignId: `TEST-FOREIGN-${songName.replace(/\s/g, '-')}`,
		type: ResourceType.SONG,
		api: SourceType.LOCAL,
		name: songName,
		title: songName,
		album,
		artist: album.artist,
	}));

	return Object.values(await createResources(songsToCreate));
}

// function dataObjectRemoteToResource(
// 	remote: CompleteDataObjectRemote
// ): Resource {
// 	switch (remote.api) {
// 		case SourceType.SPOTIFY:
// 			return dataObjectToSpotifyResource(remote);
// 	}
// }

// function dataObjectToResource(dataObject: DataObject): Resource {
// 	if (dataObject.remotes.length === 0) {
// 		throw new Error(
// 			'No remotes attached to data object, cannot convert to resource'
// 		);
// 	}

// 	const mainRemote;

// 	for (const remote of dataObject.remotes) {
// 	}
// }

// async function findFirst(where: Record<string, any>): Promise<Resource | null> {
// 	const foundDataObject = await db.dataObject.findFirst({
// 		where,
// 		include: {
// 			remotes: {
// 				include: {
// 					values: {
// 						include: {
// 							dataObject: true,
// 						},
// 					},
// 				},
// 			},
// 		},
// 	});

// 	return foundDataObject ? dataObjectToResource(foundDataObject) : null;
// }

// async function findResourceById(id: DataObject['id']): Promise<Resource> {}

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
	const hashedPassword = await bcrypt.hash('123456789', 10);

	const user = await db.user.upsert({
		where: {
			email: 'lukas@mateffy.me',
		},
		update: {},
		create: {
			name: 'Lukas',
			email: 'lukas@mateffy.me',
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});

	const artistsData: Record<string, Artist> = {
		michaelJackson: {
			id: 'michaelJackson',
			foreignId: '5Z9ZqZyZz7zXaJQ7jackson',
			title: 'Michael Jackson',
			type: ResourceType.ARTIST,
			api: SourceType.SPOTIFY,
			name: 'Michael Jackson',
		},
		nirvana: {
			id: 'nirvana',
			foreignId: '5Z9ZqZyZz7zXaJQ7nirvana',
			title: 'Nirvana',
			name: 'Nirvana',
			type: ResourceType.ARTIST,
			api: SourceType.SPOTIFY,
		},
	};

	const artists = await createResources(Object.values(artistsData));

	const albumsData: Record<string, Album> = {
		bad: {
			id: 'bad',
			foreignId: '5Z9ZqZyZz7zXaJQ7bad',
			title: 'Bad',
			type: ResourceType.ALBUM,
			api: SourceType.SPOTIFY,
			name: 'Bad',
			artist: artistsData.michaelJackson,
		},
		nevermind: {
			id: 'nevermind',
			foreignId: '5Z9ZqZyZz7zXaJQ7nevermind',
			title: 'Nevermind',
			type: ResourceType.ALBUM,
			api: SourceType.SPOTIFY,
			name: 'Nevermind',
			artist: artistsData.nirvana,
		},
	};

	const albums = await createResources(Object.values(albumsData));

	const badSongs = await createAlbumSongs(
		[
			'Bad',
			'The Way You Make Me Feel',
			'Speed Demon',
			'Liberian Girl',
			'Just Good Friends',
			'Another Part of Me',
			'Man in the Mirror',
			"I Just Can't Stop Loving You",
			'Dirty Diana',
			'Smooth Criminal',
			'Leave Me Alone',
		],
		albumsData.bad
	);

	const nevermindSongs = await createAlbumSongs(
		[
			'Smells Like Teen Spirit',
			'In Bloom',
			'Come as You Are',
			'Breed',
			'Lithium',
			'Polly',
			'Territorial Pissings',
			'Drain You',
			'Lounge Act',
			'Stay Away',
			'On a Plain',
			'Something in the Way',
			'Endless, Nameless',
		],
		albumsData.nevermind
	);

	const listsData: List[] = [
		{
			id: 'eba1e99b-bc2a-4842-b0ee-52dc165353df',
			title: 'Favourite Michael Jackson songs',
			description: 'Michael Jackson songs',
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: user.id,
		},
		{
			id: '10fd2a35-fade-46c0-8242-8bb9cc263576',
			title: 'Rock songs',
			description: 'The best of rock',
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: null,
		},
	];

	for (let list of listsData) {
		list = await upsertList(list);

		switch (list.id) {
			case 'eba1e99b-bc2a-4842-b0ee-52dc165353df':
				await addResourceToList(list.id, badSongs[0].id);
				await addResourceToList(list.id, badSongs[1].id);
				break;

			case '10fd2a35-fade-46c0-8242-8bb9cc263576':
				await addResourceToList(list.id, nevermindSongs[0].id);
				await addResourceToList(list.id, nevermindSongs[1].id);
				break;
		}
	}

	// const smoothOperator = await db.listItem.create({
	// 	data: {
	// 		title: 'Smooth Operator',
	// 		type: 'song', // song, video, file
	// 		remotes: {
	// 			create: [
	// 				{
	// 					type: 'spotify:song',
	// 					remoteId:
	// 						'https://open.spotify.com/track/7CnOzCWGrTINcDExG6u99y?si=fb23039dbb4448f5',
	// 				},
	// 			],
	// 		},
	// 		// tags: [{ create: { tagName: tags.favouriteSongs.name } }],
	// 	},
	// });

	// const exampleBookmark = await db.listItem.create({
	// 	data: {
	// 		title: 'Text Rendering Hates You',
	// 		type: 'bookmark', // song, video, file
	// 		remotes: {
	// 			create: {
	// 				type: 'pocket:bookmark',
	// 				remoteId: '34598034',
	// 				// uri: 'https://gankra.github.io/blah/text-hates-you/',
	// 			},
	// 		},
	// 	},
	// });

	// const spotifyList = await db.list.create({
	// 	data: {
	// 		title: 'elegant kush puffen',
	// 		description: 'für die brennende lunte im mund',
	// 		tags: {
	// 			create: [
	// 				{
	// 					tagName: tags.playlist.name,
	// 				},
	// 				{
	// 					tagName: tags.spotify.name,
	// 				},
	// 			],
	// 		},
	// 		items: {
	// 			create: [
	// 				{
	// 					listItemId: smoothCriminal.id,
	// 				},
	// 				{
	// 					listItemId: smoothOperator.id,
	// 				},
	// 			],
	// 		},
	// 	},
	// });

	// const pocketList = await db.list.create({
	// 	data: {
	// 		title: 'Pocket bookmarks',
	// 		description: 'Synchronized Pocket bookmarks',
	// 		items: {
	// 			create: [
	// 				{
	// 					listItemId: exampleBookmark.id,
	// 				},
	// 			],
	// 		},
	// 	},
	// });
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
