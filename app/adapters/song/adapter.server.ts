import invariant from 'tiny-invariant';

import {
	CompleteDataObject,
	composeRefFromValue,
	composeResourceBase,
	DataObjectValueMap,
	getEmptyDetails,
	valuesToObject,
} from '~/models/resource/adapters.server';
import { ResourceType } from '~/models/resource/types';
import type { Song } from '~/adapters/song/type';

export function dataObjectToSong(
	dataObject: CompleteDataObject,
	values?: DataObjectValueMap
): Song {
	values = values ?? valuesToObject(dataObject.values);

	const name = composeRefFromValue<string>(values.name);

	invariant(name, 'Missing name');

	return {
		...composeResourceBase<ResourceType.SONG>(dataObject),
		// additional spotify-specific fields
		values: {
			name,
			artist: composeRefFromValue<string>(values.artist),
			album: composeRefFromValue<string>(values.album),
		},
		// artist: values.has('artist') ? values.get('artist') : undefined,
	};
}

export const getSongDetails = getEmptyDetails;