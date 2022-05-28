import type { User } from '~/models/user.server';

import React, { useState } from 'react';
import { NavLink } from 'remix';

import {
	Collection,
	GroupType,
	GROUP_ICONS,
	GROUP_TYPES,
	GROUP_TYPE_ITEMS,
	ResourceType,
	SourceType,
} from '~/models/resource/types';
import {
	BookmarkIcon,
	CollectionIcon,
	MusicNoteIcon,
	UsersIcon,
	VideoCameraIcon,
} from '@heroicons/react/solid';
import SearchBox from '~/components/views/search-box';
import SpotifyIcon from '~/components/icons/spotify-icon';
import Player from './player';
import { composeResourceUrl } from '~/utilities/resource-url';
import { ArrowBarLeft, Ethernet, List } from 'react-bootstrap-icons';

const listItemDarkClass = `dark:hover:text-theme-200 dark:hover:bg-theme-700 dark:focus:bg-theme-700 dark:focus:border-theme-600`;
const listItemLightClass = `hover:text-theme-800 hover:bg-theme-200 bg-opacity-60 focus:bg-theme-300 focus:border-theme-400`;
const listItemBaseClass = `flex items-center justify-start gap-2 rounded py-1 px-2 text-sm border ${listItemLightClass} ${listItemDarkClass}`;

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
					? `${listItemBaseClass} ${className} border-theme-400 bg-theme-300 text-theme-800 dark:border-theme-600 dark:bg-theme-700 dark:text-theme-200`
					: `${listItemBaseClass} ${className} border-transparent bg-transparent text-theme-600 dark:text-theme-400`
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
	[ResourceType.WEBPAGE]: <BookmarkIcon />,
	[ResourceType.VIDEO]: <VideoCameraIcon />,
};

const SOURCE_ICONS: { [key in SourceType]?: React.ReactNode } = {
	[SourceType.SPOTIFY]: <SpotifyIcon />,
};

type SidebarProps = {
	user?: User;
	collections?: Collection[];
};

function GroupLink({
	active,
	to,
	onClick,
	children,
}: {
	active?: boolean;
	to: string;
	onClick?: () => void;
	children: JSX.Element;
}) {
	const className =
		'flex h-16 items-center justify-center bg-opacity-50  hover:bg-theme-300 dark:hover:bg-theme-600 ';

	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				(active === undefined && isActive) || active
					? `${className} bg-theme-400 text-theme-700 dark:bg-theme-700 dark:text-theme-200`
					: `${className} cursor-pointer bg-transparent text-theme-400`
			}
			onClick={onClick}
		>
			<figure className="h-8 w-8">{children}</figure>
		</NavLink>
	);
}

export default function Sidebar({ user, collections = [] }: SidebarProps) {
	const [typeGroup, setTypeGroup] = useState<GroupType>(GroupType.MUSIC);
	const [extended, setExtended] = useState(true);
	// const groups = Object.entries() as [GroupType, string][];

	return (
		<aside className="z-10 flex h-full max-w-sm border-r-2 border-theme-200  dark:border-theme-800">
			<section className=" z-20 flex h-full  flex-col justify-between gap-5 bg-theme-100 bg-opacity-40 shadow-lg dark:bg-theme-800 dark:bg-opacity-60">
				<header className="flex w-full flex-col items-center justify-between">
					<button
						className="flex h-16 w-16 items-center justify-center text-xs font-semibold text-theme-600 dark:text-theme-400"
						onClick={() => setExtended(!extended)}
					>
						{extended ? <ArrowBarLeft size={30} /> : <List size={30} />}
					</button>
					<nav className="flex w-full flex-col">
						{GROUP_TYPES.map((group) => (
							<GroupLink
								key={group}
								to={`/library/${group}`}
								active={group === typeGroup}
								onClick={() => {
									setTypeGroup(group);
									setExtended(true);
								}}
							>
								{GROUP_ICONS[group]}
							</GroupLink>
						))}
					</nav>
				</header>

				<footer>
					<GroupLink to={`/connections`}>
						<Ethernet className="h-full w-full" />
					</GroupLink>
				</footer>
			</section>
			<section
				className={`${
					extended ? `translate-x-0` : `absolute -translate-x-full`
				}  flex flex-1 transform flex-col justify-between bg-theme-100 bg-opacity-30 transition dark:bg-theme-900 dark:bg-opacity-30`}
			>
				<SearchBox className="py-2 px-2" />
				<hr className="border-theme-700" />

				<div className="flex flex-1 flex-col gap-5 overflow-y-scroll px-3 py-2">
					<section>
						<h2 className="mb-3 text-xs font-semibold text-theme-500">
							Library
						</h2>
						<nav className="flex flex-col gap-1 font-medium">
							{GROUP_TYPE_ITEMS[typeGroup].map((item) => (
								<SidebarListItem
									key={item.label}
									to={`/library/${typeGroup}/${item.type}`}
								>
									<figure className="w-5 text-theme-500">
										{LIBRARY_ICONS[item.type]}
									</figure>
									{item.label}
								</SidebarListItem>
							))}
						</nav>
					</section>
					<hr className="border-theme-700" />
					<section className="flex flex-col">
						<h2 className="mb-2 text-xs font-semibold text-theme-500">
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
									<figure className="w-5 text-theme-500">
										{collection.values.source &&
											SOURCE_ICONS[collection.values.source.value]}
									</figure>
								</SidebarListItem>
							))}
						</nav>
					</section>
				</div>
				{/* {user && (
				<footer className="flex w-full items-center justify-start gap-5 bg-theme-800 px-5 py-3">
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
								className="rounded-full bg-theme-700 px-4 py-1 text-sm font-semibold text-white"
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
