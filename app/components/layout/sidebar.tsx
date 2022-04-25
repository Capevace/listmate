import type { User } from '~/models/user.server';

import React, { useState } from 'react';
import { Form, NavLink } from 'remix';

import {
	Collection,
	GroupType,
	GROUP_TYPES,
	GROUP_TYPE_ITEMS,
	ResourceType,
} from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';

import {
	BookmarkIcon,
	CollectionIcon,
	MusicNoteIcon,
	UsersIcon,
} from '@heroicons/react/solid';
import { Select } from '@mantine/core';
import SearchBox from '~/components/views/search-box';

const listItemBaseClass =
	'flex items-center justify-start gap-2 rounded py-1 px-2 text-sm border hover:text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:border-gray-600 focus:border-gray-600';

const listItemClassName = ({ isActive }: { isActive: boolean }) =>
	isActive
		? `${listItemBaseClass} border-gray-600 bg-gray-700 text-gray-200`
		: `${listItemBaseClass} border-transparent bg-transparent text-gray-400`;

function SidebarListItem({
	to,
	children,
}: {
	to: string;
	children: React.ReactNode;
}) {
	return (
		<NavLink to={to} className={listItemClassName}>
			{children}
		</NavLink>
	);
}

const LIBRARY_ICONS: { [key in ResourceType]?: React.ReactNode } = {
	[ResourceType.SONG]: <MusicNoteIcon />,
	[ResourceType.ALBUM]: <CollectionIcon />,
	[ResourceType.ARTIST]: <UsersIcon />,
	[ResourceType.BOOKMARK]: <BookmarkIcon />,
};

type SidebarProps = {
	user?: User;
	collections?: Collection[];
};

export default function Sidebar({ user, collections = [] }: SidebarProps) {
	const [typeGroup, setTypeGroup] = useState(GroupType.MUSIC);

	return (
		<aside className="flex h-full max-w-sm flex-col justify-between border-r-2 border-gray-800 bg-gray-900">
			<SearchBox className="py-2 px-2" />
			<div className="flex flex-1 flex-col gap-5 overflow-y-scroll px-2 py-2">
				<section>
					<h2 className="mb-2 text-xs text-gray-400">
						<span className="mb-2 block">Library</span>
						{/* TODO: replace Mantine component with own one, this is for prototyping */}
						<Select
							styles={{
								input: {
									fontSize: 'inherit',
									color: 'inherit',
									fontWeight: 'inherit',
								},
							}}
							className="w-full text-lg font-bold text-gray-400"
							color="gray"
							variant="unstyled"
							value={typeGroup}
							onChange={(value) => setTypeGroup(value as GroupType)}
							data={GROUP_TYPES.map((type) => {
								return {
									value: type,
									label: capitalize(type.toLowerCase()),
								};
							})}
						/>
					</h2>
					<nav className="flex flex-col gap-1">
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
					<h2 className="mb-2 text-xs text-gray-400">Collections</h2>
					<nav className="flex flex-1 flex-col gap-1">
						{collections.map((collection) => (
							<SidebarListItem
								key={collection.id}
								to={`/resources/${collection.id}`}
							>
								{collection.title}
							</SidebarListItem>
						))}
					</nav>
				</section>
			</div>
			{user && (
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
			)}
		</aside>
	);
}
