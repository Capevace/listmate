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
import type { Channel } from './type';

export function dataObjectToChannel(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Channel {
	values = values ?? valuesToObject(dataObject.values);

	const name = composeRefFromValue(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.CHANNEL>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			description: composeRefFromValue(values.description),
			url: composeRefFromValue(values.url),
			createdAt: composeRefFromValue<Date>(
				values.createdAt,
				(v) => new Date(v)
			),
		},
	};
}

export function serializeChannelValues(
	values: Channel['values']
): SerializedValues<Channel['values']> {
	return {
		...values,
		createdAt: values.createdAt
			? {
					value: values.createdAt.value.toISOString(),
			  }
			: null,
	};
}

export const getChannelDetails = getEmptyDetails;
