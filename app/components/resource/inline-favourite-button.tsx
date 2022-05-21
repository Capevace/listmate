import type { Resource } from '~/models/resource/types';
import { useState } from 'react';
import { Form, useLocation, useTransition } from 'remix';

import {
	HeartFill as HeartFillIcon,
	Heart as HeartOutlineIcon,
} from 'react-bootstrap-icons';

import { InlineButton } from '../forms/inline-button';
import { composeResourceUrl } from '~/utilities/resource-url';

type FavouriteButtonProps = {
	resource: Resource;
	className?: string;
};

export default function InlineFavouriteButton({
	resource,
	className,
}: FavouriteButtonProps) {
	const location = useLocation();
	const transition = useTransition();
	const isFavourite = transition.submission?.action.includes(resource.id)
		? !resource.isFavourite
		: resource.isFavourite;

	const [isFavouriteState, setIsFavouriteState] = useState(isFavourite);

	const heartClass = isFavouriteState ? 'text-gray-300' : 'text-gray-500';

	return (
		<Form
			replace
			method="post"
			action={composeResourceUrl(resource, 'favourite')}
			onSubmit={(e) => {
				setIsFavouriteState(!isFavouriteState);
			}}
			className={`${className} flex items-center`}
		>
			<input
				type="hidden"
				name="isFavourite"
				value={String(!isFavouriteState)}
			/>
			<input type="hidden" name="redirectTo" value={location.pathname} />

			<InlineButton type="submit">
				{isFavouriteState ? (
					<HeartFillIcon size={20} />
				) : (
					<HeartOutlineIcon size={20} />
				)}
			</InlineButton>
		</Form>
	);
}
