import type { User } from '~/models/user.server';

import React, { useState } from 'react';
import { Form, NavLink } from 'remix';

import {
	Collection,
	GroupType,
	GROUP_ICONS,
	GROUP_TYPES,
	GROUP_TYPE_ITEMS,
	ResourceType,
	SourceType,
} from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';

import {
	BookmarkIcon,
	CollectionIcon,
	MusicNoteIcon,
	UsersIcon,
	VideoCameraIcon,
} from '@heroicons/react/solid';
import { Select } from '@mantine/core';
import SearchBox from '~/components/views/search-box';
import SpotifyIcon from '~/components/icons/spotify-icon';
import Player from './player';
import { composeResourceUrl } from '~/utilities/resource-url';

const listItemBaseClass =
	'flex items-center justify-start gap-2 rounded py-1 px-2 text-sm border hover:text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-600 focus:border-gray-600';

function SidebarListItem({
	to,
	className,
	children,
}: {
	to: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<NavLink
			end
			to={to}
			className={({ isActive }) =>
				isActive
					? `${listItemBaseClass} ${className} border-gray-600 bg-gray-700 text-gray-200`
					: `${listItemBaseClass} ${className} border-transparent bg-transparent text-gray-400`
			}
		>
			{children}
		</NavLink>
	);
}

const LIBRARY_ICONS: { [key in ResourceType]?: React.ReactNode } = {
	[ResourceType.SONG]: <MusicNoteIcon />,
	[ResourceType.ALBUM]: <CollectionIcon />,
	[ResourceType.ARTIST]: <UsersIcon />,
	[ResourceType.BOOKMARK]: <BookmarkIcon />,
	[ResourceType.VIDEO]: <VideoCameraIcon />,
};

const SOURCE_ICONS: { [key in SourceType]?: React.ReactNode } = {
	[SourceType.SPOTIFY]: <SpotifyIcon />,
};

type SidebarProps = {
	user?: User;
	collections?: Collection[];
};

function GroupLink({ group }: { group: GroupType }) {
	const className = 'flex h-16 items-center justify-center bg-opacity-50 ';

	return (
		<NavLink
			key={group}
			to={`/library/${group}`}
			className={({ isActive }) =>
				isActive
					? `${className} bg-gray-700 text-gray-200`
					: `${className} bg-transparent text-gray-400`
			}
		>
			<figure className="h-8 w-8">{GROUP_ICONS[group]}</figure>
		</NavLink>
	);
}

export default function Sidebar({ user, collections = [] }: SidebarProps) {
	const [typeGroup, setTypeGroup] = useState(GroupType.MUSIC);
	// const groups = Object.entries() as [GroupType, string][];

	return (
		<aside className="z-10 flex h-full max-w-sm border-r-2 border-gray-800">
			<section className="flex  w-16 flex-col gap-5 bg-gray-800 bg-opacity-60">
				<header className="flex h-16 items-center justify-center">
					<h2 className="text-2xl font-semibold text-gray-200 dark:text-gray-400">
						L
					</h2>
				</header>
				<nav className="flex flex-col">
					{GROUP_TYPES.map((group) => (
						<GroupLink key={group} group={group} />
					))}
				</nav>
			</section>
			<section className="flex flex-1 flex-col justify-between bg-gray-900 bg-opacity-60">
				<SearchBox className="py-2 px-2" />
				<hr className="border-gray-700" />

				<div className="flex flex-1 flex-col gap-5 overflow-y-scroll px-3 py-2">
					<section>
						<h2 className="mb-3 text-xs font-semibold text-gray-500">
							Library
						</h2>
						<nav className="flex flex-col gap-1 font-medium">
							{GROUP_TYPE_ITEMS[typeGroup].map((item) => (
								<SidebarListItem
									key={item.label}
									to={`/library/${typeGroup}/${item.type}`}
								>
									<figure className="w-5 text-gray-500">
										{LIBRARY_ICONS[item.type]}
									</figure>
									{item.label}
								</SidebarListItem>
							))}
						</nav>
					</section>
					<hr className="border-gray-700" />
					<section className="flex flex-col">
						<h2 className="mb-2 text-xs font-semibold text-gray-500">
							Collections
						</h2>
						<nav className="flex flex-1 flex-col gap-1">
							{collections.map((collection) => (
								<SidebarListItem
									key={collection.id}
									to={composeResourceUrl(collection)}
									className="flex justify-between"
								>
									{collection.title}
									<figure className="w-5 text-gray-500">
										{collection.values.source &&
											SOURCE_ICONS[collection.values.source.value]}
									</figure>
								</SidebarListItem>
							))}
						</nav>
					</section>
				</div>
				{/* {user && (
				<footer className="flex w-full items-center justify-start gap-5 bg-gray-800 px-5 py-3">
					<div className="flex items-center">
						<img
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
							alt="User"
							className="mr-4 h-8 w-8 rounded-full"
						/>
						<div className="text-lg text-white">
							<span className="font-bold">{user.name}</span>
						</div>
					</div>
					<div className="flex items-center">
						<Form action="/logout" method="post">
							<button
								type="submit"
								className="rounded-full bg-gray-700 px-4 py-1 text-sm font-semibold text-white"
							>
								Logout
							</button>
						</Form>
					</div>
				</footer>
			)} */}
				{typeof document !== 'undefined' && <Player />}
			</section>
		</aside>
	);
}
