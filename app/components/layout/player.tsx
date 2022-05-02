import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	PauseIcon,
	PlayIcon,
	ViewListIcon,
	VolumeUpIcon,
} from '@heroicons/react/solid';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'remix';
import { Class } from 'type-fest';
import { Resource, Song, SourceType } from '~/models/resource/types';
import composeCoverUrl from '~/utilities/cover-url';
import { usePlayer } from '../player/use-player';

const track = {
	id: '4Y5fyQ5fBysC32Na5sZT3J',
	uri: 'spotify:track:4Y5fyQ5fBysC32Na5sZT3J',
	type: 'track',
	uid: '47c2c047d5eeae44f19e',
	linked_from: { uri: null, id: null },
	media_type: 'audio',
	track_type: 'audio',
	name: 'Everything Happens to Me',
	duration_ms: 305234,
	artists: [
		{ name: 'Chet Baker', uri: 'spotify:artist:3rxeQlsv0Sc2nyYaZ5W71T' },
	],
	album: {
		uri: 'spotify:album:05GsIfSvuy3bSY5EodA0Cc',
		name: 'Chet Baker Sings: It Could Happen To You [Original Jazz Classics Remasters] (OJC Remaster)',
		images: [
			{
				url: 'https://i.scdn.co/image/ab67616d0000b2731200e79c84a8d967d5f727e9',
				height: 640,
				width: 640,
			},
			{
				url: 'https://i.scdn.co/image/ab67616d000048511200e79c84a8d967d5f727e9',
				height: 64,
				width: 64,
			},
			{
				url: 'https://i.scdn.co/image/ab67616d00001e021200e79c84a8d967d5f727e9',
				height: 300,
				width: 300,
			},
		],
	},
	is_playable: true,
};

export default function Player() {
	const [playerState, multiPlayer] = usePlayer();

	if (!playerState || !multiPlayer) {
		return <></>;
	}

	const currentTrack = playerState.currentTrack;
	const song = (currentTrack?.resource ?? null) as Song | null;
	const coverUrl = playerState.currentTrack
		? composeCoverUrl(playerState.currentTrack.resource)
		: null;

	return (
		currentTrack &&
		song && (
			<footer className="relative flex w-full flex-col bg-gray-700 ">
				<section className="flex gap-3 px-3 py-2 text-xs font-medium text-gray-200">
					{coverUrl && (
						<figure className="aspect-square w-8 overflow-hidden rounded-md">
							<img src={coverUrl} className="w-full" alt="" />
						</figure>
					)}
					<div className="flex flex-col ">
						<div>{song.values.name.value}</div>
						<div className="text-gray-400">{song.values.artist?.value}</div>
					</div>
				</section>

				<nav className="relative flex items-center justify-between bg-gray-800 px-3 py-2 pt-4">
					<div
						className="absolute top-0 left-0 right-0 block h-1.5 cursor-pointer bg-green-900"
						onClick={(e) => {
							e.stopPropagation();
							const target = e.target as HTMLDivElement;
							multiPlayer.seek(
								(e.clientX / target.offsetWidth) * playerState.position.total
							);
						}}
					></div>
					<div
						className="absolute top-0 left-0 h-1 bg-green-600"
						style={{
							width: `${
								(playerState.position.current / playerState.position.total) *
								100
							}%`,
						}}
					></div>
					<section>
						<VolumeUpIcon className="w-5" />
					</section>
					<section>
						<button
							className="w-7 text-gray-500 hover:text-gray-300"
							onClick={() => multiPlayer.previous()}
						>
							<ChevronDoubleLeftIcon className="w-full" />
						</button>
						<button
							className="w-8 text-gray-400 hover:text-gray-300"
							onClick={() => multiPlayer.togglePlay()}
						>
							{playerState.playing ? (
								<PauseIcon className="w-full" />
							) : (
								<PlayIcon className="w-full" />
							)}
						</button>
						<button
							className="w-7 text-gray-500 hover:text-gray-300"
							onClick={() => multiPlayer.next()}
						>
							<ChevronDoubleRightIcon className="w-full" />
						</button>
					</section>
					<section>
						<Link to="/library/player/queue">
							<ViewListIcon className="w-5" />
						</Link>
					</section>
				</nav>
			</footer>
		)
	);
}
