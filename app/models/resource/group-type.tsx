import {
	BookmarksFill as BookmarksFillIcon,
	Film as FilmIcon,
	MusicNote,
	MusicNoteList as MusicNoteListIcon,
} from 'react-bootstrap-icons';
import { ResourceType, SourceType } from './types';

export enum GroupType {
	MUSIC = 'music',
	BOOKMARKS = 'bookmarks',
	VIDEOS = 'videos',
}

export const GROUP_TYPES = [
	GroupType.MUSIC,
	GroupType.BOOKMARKS,
	GroupType.VIDEOS,
];

export type GroupTypeItem = { label: string; type: ResourceType };

export const GROUP_SOURCE_MAP: { [key in GroupType]: SourceType[] } = {
	[GroupType.MUSIC]: [
		SourceType.SPOTIFY,
		SourceType.YOUTUBE,
		SourceType.SOUNDCLOUD,
	],
	[GroupType.BOOKMARKS]: [SourceType.POCKET],
	[GroupType.VIDEOS]: [SourceType.YOUTUBE],
};

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
	[GroupType.VIDEOS]: [
		{
			label: 'Videos',
			type: ResourceType.VIDEO,
		},
	],
};

export const GROUP_ICONS: { [key in GroupType]: JSX.Element } = {
	[GroupType.MUSIC]: <MusicNoteListIcon />,
	[GroupType.BOOKMARKS]: <BookmarksFillIcon />,
	[GroupType.VIDEOS]: <FilmIcon />,
};

export function stringToGroupType(type: string): GroupType {
	switch (type) {
		case 'music':
			return GroupType.MUSIC;
		case 'bookmarks':
			return GroupType.BOOKMARKS;
		case 'videos':
			return GroupType.VIDEOS;
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
