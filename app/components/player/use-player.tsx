import { useContext } from 'react';
import { PlayerContext } from './context';

export const usePlayer = () => {
	const player = useContext(PlayerContext);
	return player;
};
