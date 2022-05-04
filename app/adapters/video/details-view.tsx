import type { Video } from './type';
import type { VideoDetails } from './adapter.server';
import { ResourceDetailsProps, SourceType } from '~/models/resource/types';

import CompactResourceView from '~/components/views/compact-view/compact-resource-header';
import ValueGrid from '~/components/resource/value-grid';
import ResourceDebugger from '~/components/resource/resource-debugger';

import { useRef } from 'react';

type VideoDetailsProps = ResourceDetailsProps<Video, VideoDetails>;

function YouTubeIFrame({ id }: { id: string }) {
	return (
		<iframe
			width="560"
			height="315"
			src={`https://www.youtube.com/embed/${id}`}
			title="YouTube video player"
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			className="mb-10 rounded"
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
				<section className="flex gap-5">
					{youtubeRemoteUri && <YouTubeIFrame id={youtubeRemoteUri} />}
					<p className="flex-1 text-sm font-medium text-gray-400">
						{resource.values.description?.value}
					</p>
				</section>
				<ValueGrid values={resource.values} />
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
