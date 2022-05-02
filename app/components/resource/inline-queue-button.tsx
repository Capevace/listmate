import type { Resource, SourceType } from '~/models/resource/types';

import { CheckIcon, PlusIcon } from '@heroicons/react/solid';
import { useEffect, useMemo, useState } from 'react';
import { usePlayer } from '~/components/player/use-player';
import { InlineButton } from '../forms/inline-button';
import { Except } from 'type-fest';

export type InlineQueueButtonProps = Except<
	React.HTMLProps<HTMLButtonElement>,
	'resource'
> & {
	resource: Resource;
	sourceType: SourceType;
	uri: string;
};
export default function InlineQueueButton(props: InlineQueueButtonProps) {
	const { resource, sourceType, uri } = props;
	const [_, multiPlayer] = usePlayer();

	const [wasClicked, setWasClicked] = useState(false);

	// useEffect(() => {
	// 	return () => {
	// 		if (clickTimeout) {
	// 			clearTimeout(clickTimeout);
	// 		}
	// 	}
	// })

	const playSong = useMemo(
		() => () => {
			if (!multiPlayer) {
				console.warn('No player found');
				return;
			}

			console.log('Queueing song', resource);

			multiPlayer.addToQueue({
				resource,
				type: sourceType,
				uri: uri,
			});

			setWasClicked(true);
			setTimeout(() => {
				setWasClicked(false);
			}, 1000);
		},
		[resource, multiPlayer, sourceType, uri]
	);

	return (
		<InlineButton {...props} resource={undefined} onClick={playSong}>
			{wasClicked ? (
				<CheckIcon className="w-6" />
			) : (
				<PlusIcon className="w-6" />
			)}
		</InlineButton>
	);
}
