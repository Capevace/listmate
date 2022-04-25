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
	return (
		<Form
			replace
			method="post"
			action={resource ? `/resources/${resource.id}/refresh` : 'refresh'}
		>
			{children ? (
				children({ loading: !!transition.submission })
			) : (
				<Button loading={!!transition.submission} type="submit">
					Refetch Data
				</Button>
			)}
		</Form>
	);
}
