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

export const RESOURCE_GROUP_MAP: { [key in ResourceType]: GroupType } = {
	[ResourceType.COLLECTION]: GroupType.MUSIC,
	[ResourceType.SONG]: GroupType.MUSIC,
	[ResourceType.ALBUM]: GroupType.MUSIC,
	[ResourceType.ARTIST]: GroupType.MUSIC,
	[ResourceType.PLAYLIST]: GroupType.MUSIC,
	[ResourceType.WEBPAGE]: GroupType.BOOKMARKS,
	[ResourceType.VIDEO]: GroupType.VIDEOS,
	[ResourceType.CHANNEL]: GroupType.VIDEOS,
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
			type: ResourceType.WEBPAGE,
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
	[GroupType.MUSIC]: <MusicNoteListIcon className="h-full w-full" />,
	[GroupType.BOOKMARKS]: <BookmarksFillIcon className="h-full w-full" />,
	[GroupType.VIDEOS]: <FilmIcon className="h-full w-full" />,
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

export function stringToGroupTypeOptional(type?: string): GroupType | null {
	try {
		return type ? stringToGroupType(type) : null;
	} catch (e) {
		return null;
	}
}
