import { ResourceDetails } from '~/models/resource/types';
import type { Video } from './type';

// export function dataObjectToVideo(
// 	dataObject: CompleteDataObject,
// 	values?: DataObjectValueMap
// ): Video {
// 	values = values ?? valuesToObject(dataObject.values);

// 	const title = composeRefFromValue(values.title, ValueType.TEXT);
// 	const publishedAt = composeRefFromValue(values.publishedAt, ValueType.DATE);

// 	invariant(title, 'Missing title');
// 	invariant(publishedAt, 'Missing publishedAt date');

// 	return {
// 		...composeResourceBase<ResourceType.VIDEO>(dataObject),
// 		// additional spotify-specific fields
// 		values: {
// 			title,
// 			publishedAt,
// 			description: composeRefFromValue(values.description, ValueType.TEXT),
// 			channel: composeRefFromValue(values.channel, ValueType.RESOURCE),
// 		},
// 	};
// }

export type VideoDetails = ResourceDetails & {};

export async function getVideoDetails(video: Video): Promise<VideoDetails> {
	return {};
}
