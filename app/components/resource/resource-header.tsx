import type { Resource } from '~/models/resource/types';

import { Button, Divider, Menu } from '@mantine/core';
import { Form, useTransition } from 'remix';
import capitalize from '~/utilities/capitalize';
import composeCoverUrl from '~/utilities/cover-url';

import Header from '~/components/views/header';
import RefreshButton from './refresh-button';
import { TrashIcon } from '@heroicons/react/solid';

export type ResourceHeaderProps = {
	resource: Resource;
	actions?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
};

export default function ResourceHeader({
	resource,
	className,
	actions,
	children,
}: ResourceHeaderProps) {
	const transition = useTransition();
	const isDeleting = transition.submission?.action.includes('delete');

	const combinedActions = (
		<>
			{actions} <RefreshButton resource={resource} />{' '}
			<Menu>
				<Form action="delete" method="post">
					{/* <Divider /> */}
					<Menu.Label>Danger zone</Menu.Label>
					<Menu.Item
						color="red"
						icon={<TrashIcon className="w-4" />}
						type="submit"
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete list'}
					</Menu.Item>
				</Form>
			</Menu>
		</>
	);

	return (
		<Header
			title={resource.title}
			subtitle={capitalize(resource.type)}
			coverUrl={composeCoverUrl(resource)}
			actions={combinedActions}
			className={className}
		>
			{children}
		</Header>
	);
}
