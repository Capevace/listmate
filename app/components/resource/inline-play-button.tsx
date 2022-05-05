import type { Resource, SourceType } from '~/models/resource/types';
import { useMemo, useState } from 'react';
import { usePlayer } from '~/components/player/use-player';
import { PlayFill as PlayIcon } from 'react-bootstrap-icons';
import { PlayerContext } from '~/components/player/types';
import { InlineButton } from '../forms/inline-button';
import { Except } from 'type-fest';
import { Loader } from '@mantine/core';

export type InlinePlayButtonProps = Except<
	React.HTMLProps<HTMLButtonElement>,
	'resource'
> & {
	resource: Resource;
	sourceType: SourceType;
	uri: string;
	context?: PlayerContext;
};
export default function InlinePlayButton(props: InlinePlayButtonProps) {
	const { resource, sourceType, uri, context } = props;
	const [_, multiPlayer] = usePlayer();
	const [wasClicked, setWasClicked] = useState(false);

	const playSong = useMemo(
		() => async () => {
			if (!multiPlayer) {
				console.warn('No player found');
				return;
			}

			console.log('Playing song', resource);

			setWasClicked(true);

			await multiPlayer.play(
				{
					resource,

					type: sourceType,
					uri: uri,
				},
				context
			);
			setWasClicked(false);
		},
		[resource, multiPlayer, sourceType, uri, context]
	);

	return (
		<InlineButton
			{...{
				...props,
				resource: undefined,
				sourceType: undefined,
				uri: undefined,
			}}
			onClick={playSong}
		>
			{wasClicked ? (
				<Loader className="w-6" color={'gray'} />
			) : (
				<PlayIcon size={'auto'} className="w-8" />
			)}
		</InlineButton>
	);
}
