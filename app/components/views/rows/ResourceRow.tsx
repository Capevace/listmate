import type { Album, Resource, Song } from '~/models/resource/types';

import { ResourceType } from '~/models/resource/types';

import SongRow from '~/adapters/song/row';
import AlbumRow from '~/adapters/album/row';
import GenericRow from './GenericRow';

export type BaseRowProps<TResource extends Resource> = {
	resource: TResource;
	style: React.CSSProperties;
	measureRef?: (el: HTMLElement | null) => void; //React.RefObject<HTMLDivElement>;
};

export const ROWS: Record<string, (props: BaseRowProps<any>) => JSX.Element> = {
	[ResourceType.SONG]: (props: BaseRowProps<Song>) => <SongRow {...props} />,
	[ResourceType.ALBUM]: (props: BaseRowProps<Album>) => <AlbumRow {...props} />,
};

export type ResourceRowProps = {
	isSeparator?: boolean;
	resource: Resource;
	style: React.CSSProperties;
	measureRef?: (el: HTMLElement | null) => void; //React.RefObject<HTMLDivElement>;
};

export default function ResourceRow({
	isSeparator,
	resource,
	style,
	measureRef,
}: ResourceRowProps) {
	if (isSeparator) {
		return <hr className="border-2 border-theme-700" />;
	}

	const Type = ROWS[resource.type] ?? GenericRow;

	return (
		<Type
			key={resource.id}
			resource={resource}
			style={style}
			measureRef={measureRef}
		/>
	);
}
