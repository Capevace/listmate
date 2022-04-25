import type { List } from '~/models/list.server';

import {
	PencilIcon,
	PlayIcon,
	PlusIcon,
	RefreshIcon,
	TrashIcon,
} from '@heroicons/react/solid';
import { Button, Divider } from '@mantine/core';
import { Form, Link } from 'remix';
import Menu from '~/components/common/menu';
import RefreshButton from '~/components/resource/refresh-button';

export type ListActions = {
	canPlay?: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
	canAddItems?: boolean;
	canRefresh?: boolean;
};

export default function ListHeader({
	list,
	actions = {},
}: {
	list: List;
	actions?: ListActions;
}) {
	const subMenuActions = {
		...actions,
		canPlay: undefined,
		canAddItems: undefined,
	};

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
					{actions.canPlay && (
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
					)}

					{actions.canAddItems && (
						<Form method="post">
							<Button
								type="submit"
								color="gray"
								size="md"
								rightIcon={<PlusIcon className="w-6" />}
							>
								Add items
							</Button>
						</Form>
					)}

					{/* Make sure at least some actions are available */}
					{Object.values(subMenuActions).some((action) => !!action) && (
						<Menu>
							{actions.canEdit && (
								<Link to="edit">
									<Menu.Item icon={<PencilIcon className="w-4" />}>
										Edit list
									</Menu.Item>
								</Link>
							)}
							{actions.canRefresh && (
								<RefreshButton>
									{({ loading }) => (
										<Menu.Item
											color="green"
											icon={<RefreshIcon className="w-4" />}
											type="submit"
											disabled={loading}
										>
											{loading ? `Refreshing...` : `Refresh list`}
										</Menu.Item>
									)}
								</RefreshButton>
							)}
							{actions.canDelete && (
								<Form action="delete" method="post">
									<Divider />
									<Menu.Label>Danger zone</Menu.Label>
									<Menu.Item
										color="red"
										icon={<TrashIcon className="w-4" />}
										type="submit"
									>
										Delete list
									</Menu.Item>
								</Form>
							)}
						</Menu>
					)}
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
