import type { Resource } from '~/models/resource/types';
import { useState } from 'react';
import { Form, useLocation, useTransition } from 'remix';

import { HeartIcon } from '@heroicons/react/solid';

type FavouriteButtonProps = {
	resource: Resource;
	className?: string;
};
export default function FavouriteButton({
	resource,
	className,
}: FavouriteButtonProps) {
	const location = useLocation();
	const transition = useTransition();
	const isFavourite = transition.submission?.action.includes(resource.id)
		? !resource.isFavourite
		: resource.isFavourite;

	const [isFavouriteState, setIsFavouriteState] = useState(isFavourite);

	const heartClass = isFavouriteState
		? 'text-red-500   stroke-2 hover:stroke-red-500 active:stroke-0 opacity-30'
		: 'text-gray-600  stroke-2 hover:stroke-gray-600  active:stroke-0 opacity-30 ';

	return (
		<Form
			replace
			method="post"
			action={`/resources/${resource.id}/favourite`}
			onSubmit={(e) => {
				setIsFavouriteState(!isFavouriteState);
			}}
			className={className}
		>
			<input
				type="hidden"
				name="isFavourite"
				value={String(!isFavouriteState)}
			/>
			<input type="hidden" name="redirectTo" value={location.pathname} />
			<button className={`${heartClass} group `} type="submit">
				<HeartIcon className="w-6 " />
			</button>
		</Form>
	);
}
