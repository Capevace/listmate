import { useMemo, useState } from 'react';
import invariant from 'tiny-invariant';
import { SourceType } from '~/models/resource/types';
import createSpotifyPlayer from './external/spotify';
import {
	ExternalPlayers,
	ExternalPlayerStates,
	MultiPlayer,
	PlayableTrack,
	PlayerContext,
	PlayerState,
	Queue,
	RepeatMode,
} from './types';

function playTrack(
	originalState: PlayerState,
	track: PlayableTrack,
	context?: PlayerContext
): PlayerState {
	const state = { ...originalState };

	if (state.currentTrack) {
		state.history.push(state.currentTrack);
	}

	state.currentTrack = track;
	state.context = context ?? null;
	state.playing = true;

	return state;
}

function determineNextTrack(originalState: PlayerState): PlayerState {
	let state = { ...originalState };

	if (state.currentTrack) state.history.push(state.currentTrack);

	if (state.repeat === RepeatMode.TRACK && state.currentTrack) {
		// Repeat track, so we do nothing here.
	} else if (state.queue.length > 0) {
		// If main queue is not empty, play next track from main queue.
		state.currentTrack = state.queue.shift() ?? null;
	} else if (state.context && state.context.queue.length > 0) {
		// If context queue is not empty, play next track from context queue.
		const newPosition = state.context.position + 1;

		if (
			newPosition >= state.context.queue.length &&
			state.repeat !== RepeatMode.CONTEXT
		) {
			// If we are at the end of the context queue and repeat is not context, we are done.
			state.context = null;
			state.currentTrack = null;
			state.playing = false;
		} else {
			state.context.position = newPosition % state.context.queue.length;
			state.currentTrack = state.context.queue[newPosition];
		}
	} else {
		// If both queues are empty, play nothing.
		state.currentTrack = null;
		state.context = null;
		state.playing = false;
	}

	return state;
}

export function useMultiPlayer(): [PlayerState, MultiPlayer] {
	const [playerState, setPlayerState] = useState<PlayerState>({
		currentTrack: null,
		position: {
			current: 0,
			total: 0,
		},
		playing: false,
		shuffle: false,
		repeat: RepeatMode.OFF,
		queue: [],
		history: [],
		context: null,
	});

	const [externalPlayers, setExternalPlayers] = useState<ExternalPlayers>(
		{} as ExternalPlayers
	);

	const [externalPlayerStates, setExternalPlayerStates] =
		useState<ExternalPlayerStates>({});

	const onPlayStateChange = useMemo(
		() =>
			async (changes: {
				sourceType: SourceType;
				position: number;
				total: number;
			}) => {
				setPlayerState((state) => ({
					...state,
					position: {
						current: changes.position,
						total: changes.total,
					},
				}));
				setExternalPlayerStates((states) => ({
					...states,
					[changes.sourceType]: changes,
				}));
			},
		[]
	);

	const initSource = useMemo(
		() => async (sourceType: SourceType) => {
			const res = await fetch(`/library/player/${sourceType}/token`, {
				credentials: 'include',
			});
			const json = await res.json();

			invariant(json.token && json.token.accessToken, 'token not found');

			switch (sourceType) {
				case SourceType.SPOTIFY:
					const spotifyPlayer = await createSpotifyPlayer(
						json.token.accessToken,
						{
							onPlayStateChange,
							onSongEnd: () => {},
							onError: (e) => {
								console.error('spotify player error', e);
							},
						}
					);
					setExternalPlayers((players) => ({
						...players,
						[sourceType]: spotifyPlayer,
					}));
					return spotifyPlayer;

				default:
					console.error('Unsupported source type', sourceType);
					throw new Error(`Unsupported source type: ${sourceType}`);
			}
		},
		[onPlayStateChange]
	);

	const play: MultiPlayer['play'] = useMemo(
		() => async (track, context) => {
			let state = playerState;
			if (track) {
				// Play track (maybe with context)
				state = playTrack(playerState, track, context);
			}

			setPlayerState(state);

			if (state.currentTrack) {
				const currentTrack = state.currentTrack;

				let player = externalPlayers[currentTrack.type];

				if (!player) {
					player = await initSource(currentTrack.type);
				}

				await player.play(
					{ multi: state, external: externalPlayerStates[currentTrack.type] },
					currentTrack.uri
				);
			}
		},
		[playerState, externalPlayers, externalPlayerStates, initSource]
	);

	const resume: MultiPlayer['resume'] = useMemo(
		() => async (type?: SourceType) => {
			let state = { ...playerState };

			if (!state.currentTrack) return;

			let player = externalPlayers[type ?? state.currentTrack.type];

			if (!player) {
				player = await initSource(type ?? state.currentTrack.type);
			}

			state.playing = true;

			await player.resume({
				multi: state,
				external: externalPlayerStates[state.currentTrack.type],
			});

			setPlayerState(state);
		},
		[playerState, externalPlayers, externalPlayerStates, initSource]
	);

	const pause: MultiPlayer['pause'] = useMemo(
		() => async (type?: SourceType) => {
			let state = { ...playerState };

			if (!state.currentTrack) return;

			let player = externalPlayers[type ?? state.currentTrack.type];

			if (!player) {
				player = await initSource(type ?? state.currentTrack.type);
			}

			state.playing = false;

			await player.pause({
				multi: state,
				external: externalPlayerStates[state.currentTrack.type],
			});

			setPlayerState(state);
		},
		[playerState, externalPlayers, externalPlayerStates, initSource]
	);

	const togglePlay: MultiPlayer['togglePlay'] = useMemo(
		() => async () => {
			if (playerState.playing) {
				pause();
			} else {
				resume();
			}
		},
		[playerState, pause, resume]
	);

	const next: MultiPlayer['next'] = useMemo(
		() => async () => {
			const type = playerState.currentTrack?.type;
			const nextState = determineNextTrack(playerState);

			if (type && playerState.playing) {
				await externalPlayers[type]?.pause({
					multi: playerState,
					external: externalPlayerStates[type],
				});
			}

			console.log(nextState);
			setPlayerState(nextState);

			if (nextState.playing && nextState.currentTrack) {
				let player = externalPlayers[nextState.currentTrack.type];

				if (!player) {
					player = await initSource(nextState.currentTrack.type);
				}

				await player.play(
					{
						multi: nextState,
						external: externalPlayerStates[nextState.currentTrack.type],
					},
					nextState.currentTrack.uri
				);
			}
		},
		[playerState, externalPlayers, externalPlayerStates, initSource]
	);

	const previous: MultiPlayer['previous'] = useMemo(
		() => async () => {
			throw new Error('not implemented');
		},
		[]
	);

	const seek: MultiPlayer['seek'] = useMemo(
		() => async (ms: number) => {
			if (!playerState.currentTrack) return;

			let player = externalPlayers[playerState.currentTrack.type];

			if (!player) {
				player = await initSource(playerState.currentTrack.type);
			}

			player.seek(
				{
					multi: playerState,
					external: externalPlayerStates[playerState.currentTrack.type],
				},
				ms
			);
		},
		[playerState, externalPlayers, externalPlayerStates, initSource]
	);

	const setShuffle: MultiPlayer['setShuffle'] = useMemo(
		() => async (shuffle: boolean) => {
			let context = playerState.context ? { ...playerState.context } : null;

			if (context) {
				context.queue = context.queue.sort(() => Math.random() - 0.5);
			}

			setPlayerState((playerState) => ({
				...playerState,
				shuffle,
				context,
			}));
		},
		[playerState]
	);

	const setRepeat: MultiPlayer['setRepeat'] = useMemo(
		() => async (repeat: RepeatMode) => {
			setPlayerState((playerState) => ({
				...playerState,
				repeat,
			}));
		},
		[]
	);

	const setQueue: MultiPlayer['setQueue'] = useMemo(
		() => async (queue: Queue) => {
			setPlayerState((playerState) => ({
				...playerState,
				queue,
			}));
		},
		[]
	);

	const addToQueue: MultiPlayer['addToQueue'] = useMemo(
		() => async (track: PlayableTrack) => {
			setPlayerState((playerState) => ({
				...playerState,
				queue: [...playerState.queue, track],
			}));
		},
		[]
	);

	const removeFromQueue: MultiPlayer['removeFromQueue'] = useMemo(
		() => async (index: number) => {
			throw new Error('not implemented');
		},
		[]
	);

	const player: MultiPlayer = {
		play,
		resume,
		pause,
		togglePlay,
		next,
		previous,
		seek,
		setShuffle,
		setRepeat,
		setQueue,
		addToQueue,
		removeFromQueue,
	};

	// useEffect(() => {
	// 	window.listmatePlayer = player;
	// }, [player]);

	return [playerState, player];
}
