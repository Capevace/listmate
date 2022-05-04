import { GroupType, Song, SourceType } from '~/models/resource/types';

import { PlayIcon, PlusIcon } from '@heroicons/react/solid';
import ResourceValueLabel from '~/components/common/resource-value-label';
import ResourceContextMenu from '~/components/common/resource-context-menu';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import composeCoverUrl from '~/utilities/cover-url';
import { usePlayer } from '~/components/player/use-player';
import { useMemo } from 'react';
import InlinePlayButton from '~/components/resource/inline-play-button';
import findPreferredRemote from '~/utilities/preferred-remote';
import InlineQueueButton from '~/components/resource/inline-queue-button';

export default function SongRow({
	resource,
	style,
}: {
	resource: Song;
	style: React.CSSProperties;
}) {
	const remote = findPreferredRemote(resource.remotes, GroupType.MUSIC);

	return (
		<li
			className="grid w-full grid-cols-12 items-center py-1 text-sm  text-gray-600 dark:text-gray-200"
			style={style}
		>
			<div className="col-span-1 grid grid-cols-3 justify-start">
				<InlineFavouriteButton
					resource={resource}
					className="col-span-1 opacity-30"
				/>
				{remote && (
					<>
						<InlinePlayButton
							className="col-span-1 opacity-30"
							resource={resource}
							sourceType={remote.type}
							uri={remote.uri}
						/>
						<InlineQueueButton
							className="col-span-1 opacity-30"
							resource={resource}
							sourceType={remote.type}
							uri={remote.uri}
						/>
					</>
				)}
			</div>
			<div className="col-span-10 flex items-center gap-4 truncate text-gray-700 dark:text-gray-300 sm:col-span-7">
				<img
					className="ml-2 aspect-square w-8 rounded"
					alt={`${resource.title} thumbnail`}
					src={resource.thumbnail ? composeCoverUrl(resource) ?? '' : ''}
					loading="lazy"
				/>
				<div className="flex flex-col truncate font-medium">
					<ResourceValueLabel
						resource={resource}
						valueRef={resource.values.name}
						forceRef={resource.id}
					/>
					<div className="font-regular truncate text-xs">
						<ResourceValueLabel
							resource={resource}
							valueRef={resource.values.artist}
						/>
					</div>
				</div>
			</div>
			<div className="col-span-3 hidden truncate sm:block">
				<ResourceValueLabel
					resource={resource}
					valueRef={resource.values.album}
				/>
			</div>
			<div className="col-span-1 flex justify-end">
				<ResourceContextMenu />
			</div>
		</li>
	);
}

SongRow.height = 35;
