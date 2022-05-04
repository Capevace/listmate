import type { Album, Resource, Song } from '~/models/resource/types';

import { ResourceType } from '~/models/resource/types';

import GenericRow from './generic-row';
import SongRow from '~/adapters/song/row';
import AlbumRow from '~/adapters/album/row';

export type BaseRowProps = {
	isSeparator?: boolean;
	resource: Resource;
	style: React.CSSProperties;
	measureRef?: (el: HTMLElement | null) => void; //React.RefObject<HTMLDivElement>;
};

export default function BaseRow({
	isSeparator,
	resource,
	style,
	measureRef,
}: BaseRowProps) {
	if (isSeparator) {
		return <hr className="border-2 border-gray-700" />;
	}
	switch (resource.type) {
		case ResourceType.SONG:
			return (
				<SongRow key={resource.id} resource={resource as Song} style={style} />
			);
		case ResourceType.ALBUM:
			return (
				<AlbumRow
					key={resource.id}
					resource={resource as Album}
					style={style}
					measureRef={measureRef}
				/>
			);
		default:
			return <GenericRow key={resource.id} resource={resource} style={style} />;
	}
}
