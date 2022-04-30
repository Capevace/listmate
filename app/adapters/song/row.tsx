import { Song, SourceType } from '~/models/resource/types';

import { PlayIcon, PlusIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';
import ResourceContextMenu from '~/components/common/resource-context-menu';
import FavouriteButton from '~/components/resource/favourite-button';
import composeCoverUrl from '~/utilities/cover-url';
import { usePlayer } from '~/components/player/use-player';
import { useMemo } from 'react';

export default function SongRow({
	resource,
	style,
}: {
	resource: Song;
	style: React.CSSProperties;
}) {
	const [_, multiPlayer] = usePlayer();

	const playSong = useMemo(
		() => () => {
			if (!multiPlayer) {
				console.warn('No player found');
				return;
			} else {
				console.log('Playing song', resource);
			}

			const remotes = Object.entries(resource.remotes) as [
				SourceType,
				string
			][];

			if (remotes.length === 0) {
				return;
			}

			const [type, uri] = remotes[0];

			multiPlayer.play({
				resource,
				type,
				uri,
			});
		},
		[resource, multiPlayer]
	);

	const addSongToQueue = () => {
		if (!multiPlayer) {
			console.warn('No player found');
			return;
		} else {
			console.log('Adding song to queue', resource);
		}

		const remotes = Object.entries(resource.remotes) as [SourceType, string][];

		if (remotes.length === 0) {
			return;
		}

		const [type, uri] = remotes[0];

		multiPlayer.addToQueue({
			resource,
			type,
			uri,
		});
	};

	return (
		<li
			className="grid w-full grid-cols-12 items-center py-1  text-sm text-gray-200"
			style={style}
		>
			<div className="col-span-1 grid grid-cols-3 justify-start">
				<FavouriteButton
					resource={resource}
					className="col-span-1 opacity-30"
				/>
				<button
					className="col-span-1 text-gray-700 hover:text-gray-400"
					onClick={playSong}
				>
					<PlayIcon className="w-6 " />
				</button>
				<button
					className="col-span-1 text-gray-700 hover:text-gray-400"
					onClick={addSongToQueue}
				>
					<PlusIcon className="w-6 " />
				</button>
			</div>
			<div className="col-span-7 flex items-center gap-3">
				<img
					className="aspect-square w-8 rounded"
					alt={`${resource.title} thumbnail`}
					src={resource.thumbnail ? composeCoverUrl(resource) ?? '' : ''}
					loading="lazy"
				/>
				<div className="flex flex-col truncate">
					<ResourceValueLabel
						valueRef={resource.values.name}
						forceRef={resource.id}
					/>
					<div className="truncate text-xs">
						<ResourceValueLabel valueRef={resource.values.artist} />
					</div>
				</div>
			</div>
			<div className="col-span-3 truncate">
				<ResourceValueLabel valueRef={resource.values.album} />
			</div>
			<div className="col-span-1 flex justify-end">
				<ResourceContextMenu />
			</div>
		</li>
	);
}

SongRow.height = 35;
