import { ResourceType } from './types';

export enum GroupType {
	MUSIC = 'music',
	BOOKMARKS = 'bookmarks',
	MOVIES = 'movies',
}

export const GROUP_TYPES = [
	GroupType.MUSIC,
	GroupType.BOOKMARKS,
	GroupType.MOVIES,
];

export type GroupTypeItem = { label: string; type: ResourceType };

export const GROUP_TYPE_ITEMS: { [key in GroupType]: GroupTypeItem[] } = {
	[GroupType.MUSIC]: [
		{
			label: 'Songs',
			type: ResourceType.SONG,
		},
		{
			label: 'Albums',
			type: ResourceType.ALBUM,
		},
		{
			label: 'Artists',
			type: ResourceType.ARTIST,
		},
	],
	[GroupType.BOOKMARKS]: [
		{
			label: 'Bookmarks',
			type: ResourceType.BOOKMARK,
		},
	],
	[GroupType.MOVIES]: [
		{
			label: 'Movies',
			type: ResourceType.ARTIST,
		},
	],
};

export function stringToGroupType(type: string): GroupType {
	switch (type) {
		case 'music':
			return GroupType.MUSIC;
		case 'bookmarks':
			return GroupType.BOOKMARKS;
		case 'movies':
			return GroupType.MOVIES;
		default:
			throw new Error(`Unknown group type: ${type}`);
	}
}

export function stringToGroupTypeOptional(type: string): GroupType | null {
	try {
		return stringToGroupType(type);
	} catch (e) {
		return null;
	}
}
