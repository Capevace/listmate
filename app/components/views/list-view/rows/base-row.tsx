import type { Resource, Song } from '~/models/resource/types';

import { ResourceType } from '~/models/resource/types';

import GenericRow from './generic-row';
import SongRow from '~/adapters/song/row';

export type BaseRowProps = {
	isSeparator?: boolean;
	resource: Resource;
	style: React.CSSProperties;
};

export default function BaseRow({
	isSeparator,
	resource,
	style,
}: BaseRowProps) {
	if (isSeparator) {
		return <hr className="border-2 border-gray-700" />;
	}
	switch (resource.type) {
		case ResourceType.SONG:
			return (
				<SongRow key={resource.id} resource={resource as Song} style={style} />
			);
		default:
			return <GenericRow key={resource.id} resource={resource} style={style} />;
	}
}
