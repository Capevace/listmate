import type { MultiPlayer, PlayerState } from './types';
import { createContext } from 'react';

export const PlayerContext = createContext<
	[PlayerState, MultiPlayer] | [null, null]
>([null, null]);
