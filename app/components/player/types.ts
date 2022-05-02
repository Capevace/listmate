import { Class } from 'type-fest';
import { Resource, SourceType } from '~/models/resource/types';

export interface SpotifyPlayer {
	deviceId: string | null;
	togglePlay(): void;
	resume(): void;
	pause(): void;
	seek(ms: number): Promise<void>;
	previousTrack(): void;
	nextTrack(): void;
	addListener(event: string, cb: (...args: any[]) => void): void;
	getCurrentState(): Promise<boolean>;
	connect(): void;
}

export interface ListmateWindow {
	Spotify: {
		Player: Class<SpotifyPlayer>;
	};
	listmatePlayer: MultiPlayer;
	onSpotifyWebPlaybackSDKReady: () => void;
}

export type PlayableTrack = {
	resource: Resource;
	uri: string;
	type: SourceType;
};

export type Queue = PlayableTrack[];

export type PlayerContext = {
	resource: Resource; // playlist, album etc.
	queue: Queue;
	position: number;
};

export enum RepeatMode {
	OFF = 'off',
	CONTEXT = 'context',
	TRACK = 'track',
}

export type PlayerState = {
	currentTrack: PlayableTrack | null;

	position: {
		current: number;
		total: number;
	};

	playing: boolean;

	/**
	 * Shuffle mode. Disabled, if false.
	 */
	shuffle: boolean;

	/**
	 * Repeat mode. Disabled, if false.
	 *
	 * Track will repeat the same track indefinitely, while context will
	 * repeat the context queue (e.g. albums).
	 */
	repeat: RepeatMode;

	/**
	 * The player queue. Can be added to by using "Add to Queue".
	 */
	queue: Queue;

	/**
	 * The history of played tracks, last track is last played.
	 */
	history: Queue;

	/**
	 * The context of the currently playing track.
	 *
	 * If a track is selected from an playlist, the context is the playlist.
	 * If a track is selected from an album, the context is the album.
	 * If a track is selected from search, no context is set.
	 *
	 * The queue contained in the context is seperate from "add to queue"-queue.
	 * It is secondary to the manual queue and will only continue once the PlayerState.queue is empty.
	 */
	context: PlayerContext | null;
};

export interface MultiPlayer {
	play(track?: PlayableTrack, context?: PlayerContext): Promise<void>;
	togglePlay(): void;
	resume(type?: SourceType): void;
	pause(type?: SourceType): void;
	next(): void;
	previous(): void;
	seek(ms: number): void;

	setShuffle(shuffle: boolean): void;
	setRepeat(repeat: RepeatMode): void;

	setQueue(queue: Queue): void;
	addToQueue(track: PlayableTrack): void;
	removeFromQueue(index: number): void;
}

export type ExternalPlayers = {
	[key in SourceType]?: ExternalPlayer<unknown>;
};

export type ExternalPlayerStates = {
	[key in SourceType]?: {};
};

export type ExternalPlayerInit = (token: string) => Promise<ExternalPlayer<{}>>;

export type State<ExternalState extends {}> = {
	multi: PlayerState;
	external: ExternalState;
};

export type ExternalPlayer<ExternalState> = {
	ref: any;
	play(state: State<ExternalState>, uri: string): Promise<void>;
	resume(state: State<ExternalState>): Promise<void>;
	pause(state: State<ExternalState>): Promise<void>;
	seek(state: State<ExternalState>, ms: number): Promise<void>;
};
