import type { List } from '~/models/list.server';
import type { ListItemData } from '~/models/item.server';
import type { Song } from '~/models/resource/types';

import { ResourceType } from '~/models/resource/types';

import GenericRow from './generic-row';
import SongRow from './song-row';

export type BaseRowProps = {
	list: List;
	item: ListItemData;
	Header?: React.ReactNode;
	style: React.CSSProperties;
	index: number;
};

export default function BaseRow({
	list,
	item,
	Header,
	style,
	index,
}: BaseRowProps) {
	switch (index) {
		case 0:
			if (Header) return <>{Header}</>;
		default:
			switch (item.resource.type) {
				case ResourceType.SONG:
					return (
						<SongRow
							key={item.id}
							list={list}
							item={item as ListItemData<Song>}
							style={style}
						/>
					);
				default:
					return (
						<GenericRow key={item.id} list={list} item={item} style={style} />
					);
			}
	}
}
