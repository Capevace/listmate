import type { Video } from './type';
import type { VideoDetails } from './adapter.server';
import { ResourceDetailsProps, SourceType } from '~/models/resource/types';

import CompactResourceView from '~/components/views/compact-view/compact-resource-header';
import ValueGrid from '~/components/resource/value-grid';
import ResourceDebugger from '~/components/resource/resource-debugger';

import { useRef } from 'react';
import BaseValue from '~/components/resource/values/base-value';
import { Except } from 'type-fest';
import filterValues from '~/utilities/filter-values';

type VideoDetailsProps = ResourceDetailsProps<Video, VideoDetails>;

function YouTubeIFrame({ id }: { id: string }) {
	return (
		<iframe
			// width="560"
			// height="315"
			src={`https://www.youtube.com/embed/${id}`}
			title="YouTube video player"
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			className="mx-auto my-5 aspect-video w-full max-w-6xl rounded-md lg:my-10"
			loading="lazy"
		></iframe>
	);
}

export default function VideoDetailsView({
	resource,
	details,
}: VideoDetailsProps) {
	const ref = useRef<HTMLElement>(null);

	const youtubeRemoteUri = resource.remotes[SourceType.YOUTUBE];

	return (
		<CompactResourceView parentRef={ref} resource={resource} showCover>
			<>
				{youtubeRemoteUri ? <YouTubeIFrame id={youtubeRemoteUri} /> : undefined}

				<h3 className="mb-1 text-sm font-medium text-theme-400">Description</h3>
				<p className="mb-10 font-medium leading-relaxed">
					{resource.values.description ? (
						<BaseValue valueRef={resource.values.description} />
					) : (
						'-'
					)}
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2">
					<section className="col-span-1">
						<h3 className="mb-1 text-sm font-medium text-theme-400">Channel</h3>
						<p className="mb-10 font-medium leading-relaxed">
							{resource.values.channel ? (
								<BaseValue valueRef={resource.values.channel} />
							) : (
								'-'
							)}
						</p>
					</section>
					<section className="col-span-1">
						<h3 className="mb-1 text-sm font-medium text-theme-400">
							Publishing date
						</h3>
						<p className="mb-10 font-medium leading-relaxed">
							{resource.values.publishedAt ? (
								<BaseValue valueRef={resource.values.publishedAt} />
							) : (
								'-'
							)}
						</p>
					</section>
				</div>
				<ValueGrid resource={resource} />
				<ResourceDebugger
					resource={resource}
					details={details}
					className="mt-5"
				/>
			</>
		</CompactResourceView>
		// <ListView
		// 	items={details.songs}
		// 	header={
		// 		<ResourceHeader resource={resource}>
		// 			<ValueGrid values={resource.values} />
		// 		</ResourceHeader>
		// 	}
		// 	headerHeight={365}
		// 	footer={
		// 		<ResourceDebugger
		// 			resource={resource}
		// 			details={details}
		// 			className="mt-5"
		// 		/>
		// 	}
		// 	footerHeight={100}
		// />
	);
}
