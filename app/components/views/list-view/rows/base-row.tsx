import type { Resource, Song } from '~/models/resource/types';

import { ResourceType } from '~/models/resource/types';

import GenericRow from './generic-row';
import SongRow from './song-row';

export type BaseRowProps = {
	resource: Resource;
	style: React.CSSProperties;
};

export default function BaseRow({ resource, style }: BaseRowProps) {
	switch (resource.type) {
		case ResourceType.SONG:
			return (
				<SongRow key={resource.id} resource={resource as Song} style={style} />
			);
		default:
			return <GenericRow key={resource.id} resource={resource} style={style} />;
	}
}
