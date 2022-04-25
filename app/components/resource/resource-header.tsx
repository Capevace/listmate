import type { Resource } from '~/models/resource/types';

import { Button } from '@mantine/core';
import { Form, useTransition } from 'remix';
import capitalize from '~/utilities/capitalize';
import composeCoverUrl from '~/utilities/cover-url';

import Header from '~/components/views/header';
import RefreshButton from './refresh-button';

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
	const combinedActions = (
		<>
			{actions} <RefreshButton resource={resource} />
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
