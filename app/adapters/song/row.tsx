import { Soundwave } from 'react-bootstrap-icons';
import ResourceContextMenu from '~/components/common/resource-context-menu';
import { usePlayer } from '~/components/player/use-player';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import InlinePlayButton from '~/components/resource/inline-play-button';
import InlineQueueButton from '~/components/resource/inline-queue-button';
import DataField from '~/components/resource/values/DataField';
import { BaseRowProps } from '~/components/views/rows/ResourceRow';
import { GroupType, Song } from '~/models/resource/types';
import composeCoverUrl from '~/utilities/cover-url';
import findPreferredRemote from '~/utilities/preferred-remote';

export default function SongRow({ resource, style }: BaseRowProps<Song>) {
	const [playerState] = usePlayer();
	const remote = findPreferredRemote(resource.remotes, GroupType.MUSIC);

	return (
		<li
			className="grid w-full grid-cols-12 items-center py-1 text-sm  text-theme-600 dark:text-theme-200"
			style={style}
		>
			<div className="col-span-1 grid grid-cols-3 justify-start">
				<InlineFavouriteButton
					resource={resource}
					className="col-span-1 opacity-30"
				/>
				{remote && (
					<>
						{playerState &&
						playerState.playing &&
						playerState.currentTrack?.resource.id === resource.id ? (
							<figure className="flex items-center justify-center">
								<Soundwave size={'auto'} className="w-6" />
							</figure>
						) : (
							<InlinePlayButton
								className="col-span-1 opacity-30"
								resource={resource}
								sourceType={remote.type}
								uri={remote.uri}
							/>
						)}

						<InlineQueueButton
							className="col-span-1 opacity-30"
							resource={resource}
							sourceType={remote.type}
							uri={remote.uri}
						/>
					</>
				)}
			</div>
			<div className="col-span-10 flex items-center gap-4 truncate text-theme-700 dark:text-theme-300 sm:col-span-7">
				<img
					className="ml-2 aspect-square w-8 truncate rounded bg-theme-200 text-xs dark:bg-theme-800"
					alt={`${resource.title} thumbnail`}
					src={resource.thumbnail ? composeCoverUrl(resource) ?? '' : ''}
					loading="lazy"
				/>
				<div className="flex flex-col truncate font-medium">
					<DataField data={resource.values.name} />
					<div className="font-regular truncate text-xs">
						<DataField data={resource.values.artist} />
					</div>
				</div>
			</div>
			<div className="col-span-3 hidden truncate sm:block">
				<DataField data={resource.values.album} />
			</div>
			<div className="col-span-1 flex justify-end">
				<ResourceContextMenu />
			</div>
		</li>
	);
}

SongRow.height = 35;
