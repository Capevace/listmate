import { PlayIcon } from '@heroicons/react/solid';
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
		<button className="text-theme-400 hover:text-theme-100" onClick={onClick}>
			<PlayIcon className="w-6" />
		</button>
	);
}
