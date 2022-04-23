import type { List } from '~/models/list.server';

import { PlayIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { Button, Menu } from '@mantine/core';
import { Form } from 'remix';

export default function ListHeader({ list }: { list: List }) {
	return (
		<div className="relative my-5 flex border border-gray-700 bg-gray-800 px-10 py-9 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<div className="flex flex-1 flex-col justify-between">
				<div className="relative mb-5 flex flex-col">
					<h1 className="mb-2 text-4xl font-bold text-gray-100">
						{list.title}
					</h1>
					<p className="text-xl text-gray-300">{list.description}</p>
				</div>
				<nav className="flex flex-shrink-0 items-center gap-3">
					<Form method="post">
						<Button
							type="submit"
							color="pink"
							size="md"
							rightIcon={<PlayIcon className="w-7" />}
						>
							Play
						</Button>
					</Form>
					<Form method="post">
						<Button
							type="submit"
							color="gray"
							size="md"
							rightIcon={<PlusIcon className="w-6" />}
						>
							Add item to list
						</Button>
					</Form>
					<Menu
						color="blue"
						classNames={{
							body: 'bg-blue-500',
						}}
					>
						<Menu.Label>Danger zone</Menu.Label>
						<Menu.Item color="red" icon={<TrashIcon className="w-4" />}>
							Delete list
						</Menu.Item>
					</Menu>
				</nav>
			</div>
			<aside
				className="relative aspect-square h-48 justify-end rounded-lg bg-cover bg-center shadow-lg"
				style={{
					backgroundImage: `url(${
						list.coverFileReferenceId
							? `/media/${list.coverFileReferenceId}`
							: `https://dummyimage.com/500x500/374151/d1d5db.png&text=%20%20%20%20%20%20${list.id}`
					})`,
				}}
			></aside>
		</div>
	);
}
