import { SourceType } from '~/models/resource/types';
import { ExternalPlayer, ListmateWindow, PlayerState } from '../types';

declare const window: ListmateWindow;

export default function createSpotifyPlayer(
	token: string,
	{
		onPlayStateChange,
		onSongEnd,
		onError,
	}: {
		onPlayStateChange: (changes: {
			sourceType: SourceType;
			playing: boolean;
			position: number;
			total: number;
		}) => void;
		onSongEnd: () => void;
		onError: (error: Error) => void;
	}
): Promise<ExternalPlayer<{}>> {
	return new Promise((resolve) => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			let deviceId: string | null = null;
			let player = new window.Spotify.Player({
				name: 'Listmate',
				token,
				getOAuthToken: (cb: (token: string) => void) => cb(token),
			});

			const api: ExternalPlayer<{}> = {
				ref: player,
				async play(state, uri) {
					await fetch(
						`/resources/${state.multi.currentTrack?.resource.id}/${state.multi.currentTrack?.type}/player/play?device_id=${deviceId}`,
						{
							method: 'POST',
							credentials: 'include',
						}
					);
				},
				async resume(state) {
					return player.resume();
				},
				async pause(state) {
					return player.pause();
				},
				async seek(state, ms) {
					return player.seek(ms);
				},
			};

			player.addListener('initialization_error', onError);
			player.addListener('authentication_error', onError);
			player.addListener('account_error', onError);
			player.addListener('playback_error', onError);

			player.addListener('player_state_changed', (state: any) => {
				console.log('spot_onplaystatechange', state);

				if (state) {
					onPlayStateChange({
						sourceType: SourceType.SPOTIFY,
						playing: !state.paused,
						position: state.position,
						total: state.duration,
					});
				}
			});

			player.addListener('ready', ({ device_id }: { device_id: string }) => {
				deviceId = device_id;

				resolve(api);
			});

			player.connect();
		};

		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.id = 'spotify-player';
		document.body.appendChild(script);
	});
}
