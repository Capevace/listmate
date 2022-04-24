import { faker } from '@faker-js/faker';
import type { List } from '~/models/list.server';
import { composeRefFromResource } from '~/models/resource/adapters.server';
import type { Album, Artist, Song } from '~/models/resource/types';
import { ResourceType } from '~/models/resource/types';

export function generateArtist(): Artist {
	const name = faker.name.findName();

	return {
		id: faker.datatype.uuid(),
		type: ResourceType.ARTIST,
		title: name,
		isFavourite: false,
		thumbnail: null,
		values: {
			name: { value: name },
		},
	};
}

export function generateSong(artist: Artist, album: Album): Song {
	const name = faker.company.bs();

	return {
		id: faker.datatype.uuid(),
		type: ResourceType.SONG,
		title: name,
		thumbnail: null,
		isFavourite: false,
		values: {
			name: { value: name },
			artist: composeRefFromResource<string>(artist),
			album: composeRefFromResource<string>(album),
		},
	};
}

export function generateAlbum(artist: Artist): {
	album: Album;
	songs: Song[];
} {
	const name = faker.company.catchPhrase();

	const album: Album = {
		id: faker.datatype.uuid(),
		type: ResourceType.ALBUM,
		title: name,
		thumbnail: null,
		isFavourite: false,
		values: {
			name: { value: name },
			artist: composeRefFromResource<string>(artist),
		},
	};

	return {
		album,
		songs: new Array(faker.datatype.number({ min: 1, max: 10 }))
			.fill(0)
			.map(() => generateSong(artist, album)),
	};
}

export function generatePlaylist(userId: string, availableSongs: Song[]) {
	const name = faker.company.catchPhrase();
	const createdAt = faker.date.past();

	const list: List = {
		id: faker.datatype.uuid(),
		title: name,
		description: faker.lorem.sentence(),
		createdAt,
		updatedAt: faker.date.between(createdAt, new Date()),
		userId,
		coverFileReferenceId: null,
	};

	return { list, songs: availableSongs };
}

export function generateLibrary(userId: string, playlistCount: number) {
	const artists = new Array(playlistCount * 4)
		.fill(0)
		.map(() => generateArtist());

	const albumsWithSongs = artists.map((artist) => generateAlbum(artist));

	const albums = albumsWithSongs.map((album) => album.album);
	const songs = albumsWithSongs.reduce(
		(acc, album) => [...acc, ...album.songs],
		[] as Song[]
	);

	const lists = new Array(playlistCount).fill(0).map(() =>
		generatePlaylist(
			userId,
			songs.filter(() => faker.datatype.boolean())
		)
	);

	return {
		artists,
		albums,
		songs,
		lists,
	};
}
