import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import ListHeader from './list-header';
import ItemList from './list';

export type ListViewProps = {
	list: List;
	items: ListItemData[];
};

export default function ListView(props: ListViewProps) {
	return (
		<>
			<ListHeader list={props.list} />
			<ItemList list={props.list} items={props.items} />
		</>
	);
}
