import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import { Song, ResourceType } from '~/models/resource/resource.types';
import GenericRow from './rows/generic-row';
import SongRow from './rows/song-row';

export type ItemListProps = {
	list: List;
	items: ListItemData[];
	onFavourite: (item: ListItemData) => void;
};

export default function ItemList({ list, items, onFavourite }: ItemListProps) {
	return (
		<ul className="flex w-full flex-col px-10">
			{items.map((item) => {
				switch (item.resource.type) {
					case ResourceType.SONG:
						return (
							<SongRow
								key={item.id}
								list={list}
								item={item as ListItemData<Song>}
								onFavourite={onFavourite}
							/>
						);
					default:
						return <GenericRow key={item.id} list={list} item={item} />;
				}
			})}
		</ul>
	);
}
