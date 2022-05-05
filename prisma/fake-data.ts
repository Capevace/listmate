import { faker } from '@faker-js/faker';
import {
	composeRefFromResource,
	composeRefFromResourceArray,
} from '~/models/resource/adapters.server';
import {
	Album,
	Artist,
	Playlist,
	Song,
	SourceType,
	ValueType,
} from '~/models/resource/types';
import { ResourceType } from '~/models/resource/types';

export function generateArtist(): Artist {
	const name = faker.name.findName();

	return {
		id: faker.datatype.uuid(),
		type: ResourceType.ARTIST,
		title: name,
		isFavourite: false,
		thumbnail: null,
		remotes: {
			local: `fake:${faker.datatype.uuid()}`,
		},
		values: {
			name: { value: name, type: ValueType.TEXT, ref: null },
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
		remotes: {
			local: `fake:${faker.datatype.uuid()}`,
		},
		values: {
			name: { value: name, type: ValueType.TEXT, ref: null },
			artist: composeRefFromResource(artist),
			album: composeRefFromResource(album),
		},
	};
}

export function generateAlbum(artist: Artist): {
	album: Album;
	songs: Song[];
} {
	const name = faker.company.catchPhrase();

	const songs = new Array(faker.datatype.number({ min: 1, max: 10 }))
		.fill(0)
		.map(() => generateSong(artist, album));

	const album: Album = {
		id: faker.datatype.uuid(),
		type: ResourceType.ALBUM,
		title: name,
		thumbnail: null,
		isFavourite: false,
		remotes: {
			local: `fake:${faker.datatype.uuid()}`,
		},
		values: {
			name: { value: name, type: ValueType.TEXT, ref: null },
			artist: composeRefFromResource(artist),
			songs: composeRefFromResourceArray(songs),
		},
	};

	return {
		album,
		songs,
	};
}

export function generatePlaylist(userId: string, availableSongs: Song[]) {
	const name = faker.company.catchPhrase();

	const album: Playlist = {
		id: faker.datatype.uuid(),
		type: ResourceType.PLAYLIST,
		title: name,
		thumbnail: null,
		isFavourite: false,
		remotes: {
			local: `fake:${faker.datatype.uuid()}`,
		},
		values: {
			name: { value: name, type: ValueType.TEXT, ref: null },
			description: {
				value: faker.lorem.sentence(),
				type: ValueType.TEXT,
				ref: null,
			},
			source: {
				value: SourceType.LOCAL,
				type: ValueType.SOURCE_TYPE,
				ref: null,
			},
			items: composeRefFromResourceArray(availableSongs),
		},
	};

	return { album, songs: availableSongs };
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
