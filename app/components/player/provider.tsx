import { FC } from 'react';
import { PlayerContext } from './context';
import { useMultiPlayer } from './use-multi-player';

export const PlayerProvider: FC = ({ children }) => {
	const player = useMultiPlayer();

	return (
		<PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
	);
};
