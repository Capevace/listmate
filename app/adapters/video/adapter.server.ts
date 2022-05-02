import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	getEmptyDetails,
	valuesToObject,
} from '~/models/resource/adapters.server';
import { ResourceType, SerializedValues } from '~/models/resource/types';
import { Channel } from '~/adapters/channel/type';
import type { Video } from './type';

export function dataObjectToVideo(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Video {
	values = values ?? valuesToObject(dataObject.values);

	const title = composeRefFromValue(values.title);
	const publishedAt = composeRefFromValue<Date>(
		values.publishedAt,
		(v) => new Date(v)
	);

	invariant(title, 'Missing title');
	invariant(publishedAt, 'Missing publishedAt date');

	return {
		...composeResourceBase<ResourceType.VIDEO>(dataObject),
		// additional spotify-specific fields
		values: {
			title,
			publishedAt,
			description: composeRefFromValue(values.title),
			channel: composeRefFromValue<string, Channel>(values.channel),
		},
	};
}

export function serializeVideoValues(
	values: Video['values']
): SerializedValues<Video['values']> {
	return {
		...values,
		publishedAt: { value: values.publishedAt.value.toISOString() },
	};
}

export async function getVideoDetails(video: Video): Promise<{}> {
	return {};
}
