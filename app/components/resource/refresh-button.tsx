import { ALL_SOURCE_TYPES, Resource } from '~/models/resource/types';

import { Form, useTransition } from 'remix';
import capitalize from '~/utilities/capitalize';

import { Button, Menu } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/solid';
import SelectButton from '~/components/forms/select-button';
import FauxNoscript from '~/components/common/faux-noscript';

type RefreshButtonProps = {
	resource?: Resource;
	children?: ({ loading }: { loading: boolean }) => JSX.Element;
};

export default function RefreshButton({
	resource,
	children,
}: RefreshButtonProps): JSX.Element {
	const transition = useTransition();
	const action = resource ? `/resources/${resource.id}/refresh` : 'refresh';
	const isLoading = transition.submission?.action === action;

	const data = ALL_SOURCE_TYPES.map((sourceType) => ({
		value: sourceType,
		label: capitalize(sourceType),
		disabled: resource && !(sourceType in resource.remotes),
	}));

	return children ? (
		children({ loading: isLoading })
	) : (
		<div className="flex items-center gap-2">
			<FauxNoscript>
				<Form replace method="post" action={action}>
					<SelectButton data={data} name="source">
						Refetch Data
					</SelectButton>
				</Form>
			</FauxNoscript>
			<Menu
				className="require-js"
				control={
					<Button
						loading={isLoading}
						color="gray"
						rightIcon={<ChevronDownIcon className="w-5" />}
					>
						Refetch Data
					</Button>
				}
			>
				{data.map((source) => (
					<Form key={source.value} replace method="post" action={action}>
						<Menu.Item
							disabled={source.disabled}
							type="submit"
							name="source"
							value={source.value}
						>
							Fetch from {source.label}
						</Menu.Item>
					</Form>
				))}
			</Menu>
		</div>
	);
}
