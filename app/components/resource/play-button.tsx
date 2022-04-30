import { PlayIcon } from '@heroicons/react/solid';
import { Button } from '@mantine/core';
import { usePlayer } from '~/components/player/use-player';
import { PlayableTrack, PlayerContext } from '~/components/player/types';

export type PlayButtonProps = {
	track: PlayableTrack;
	playContext?: PlayerContext;
};

export default function PlayButton({ track, playContext }: PlayButtonProps) {
	const [playerState, player] = usePlayer();

	const onClick = () => {
		player?.play(track, playContext);
	};

	return (
		<Button
			variant="filled"
			color="gray"
			rightIcon={<PlayIcon className="w-6" />}
			onClick={onClick}
		>
			Play
		</Button>
	);
}
