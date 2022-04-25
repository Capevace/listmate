import type { Resource } from '~/models/resource/types';
import { Form, useTransition } from 'remix';
import { Button } from '@mantine/core';

type RefreshButtonProps = {
	resource?: Resource;
	children?: ({ loading }: { loading: boolean }) => React.ReactNode;
};

export default function RefreshButton({
	resource,
	children,
}: RefreshButtonProps) {
	const transition = useTransition();
	const action = resource ? `/resources/${resource.id}/refresh` : 'refresh';
	const isLoading = transition.submission?.action === action;

	return (
		<Form replace method="post" action={action}>
			{children ? (
				children({ loading: isLoading })
			) : (
				<Button loading={isLoading} type="submit">
					Refetch Data
				</Button>
			)}
		</Form>
	);
}
