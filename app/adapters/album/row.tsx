import DataField from '~/components/resource/values/DataField';
import { BaseRowProps } from '~/components/views/rows/ResourceRow';
import { Album, GroupType } from '~/models/resource/types';
import composeCoverUrl from '~/utilities/cover-url';
import findPreferredRemote from '~/utilities/preferred-remote';

export default function AlbumRow({
	resource,
	style,
	measureRef,
}: BaseRowProps<Album>) {
	// const remote = findPreferredRemote(resource.remotes, GroupType.MUSIC);

	return (
		<article
			className="flex w-auto items-center gap-4 overflow-hidden rounded"
			style={style}
			ref={measureRef}
		>
			<figure className="aspect-square w-16">
				<img
					className="h-full w-full"
					alt={`${resource.title} thumbnail`}
					src={resource.thumbnail ? composeCoverUrl(resource) ?? '' : ''}
					loading="lazy"
				/>
			</figure>
			<div className="flex flex-col truncate font-medium text-theme-700 dark:text-theme-300">
				<DataField data={resource.values.name} />
				<div className="font-regular truncate text-xs">
					<DataField data={resource.values.artist} />
				</div>
			</div>

			{/* <div className="col-span-1 grid grid-cols-3 justify-start">
				<InlineFavouriteButton
				
					className="col-span-1 opacity-30"
				/>
				{remote && (
					<>
						<InlinePlayButton
							className="col-span-1 opacity-30"
						
							sourceType={remote.type}
							uri={remote.uri}
						/>
						<InlineQueueButton
							className="col-span-1 opacity-30"
						
							sourceType={remote.type}
							uri={remote.uri}
						/>
					</>
				)}
			</div>
			<div className="col-span-7 flex items-center gap-4 text-theme-700 dark:text-theme-300">
				<div className="flex flex-col truncate font-medium">
					<DataField
					
						data={resource.values.name}
						forceRef={resource.id}
					/>
					<div className="font-regular truncate text-xs">
						<DataField
						
							data={resource.values.artist}
						/>
					</div>
				</div>
			</div>
			<div className="col-span-3 truncate">
				<DataField
				
					data={resource.values.album}
				/>
			</div>
			<div className="col-span-1 flex justify-end">
				<ResourceContextMenu />
			</div> */}
		</article>
	);
}

AlbumRow.height = 35;
