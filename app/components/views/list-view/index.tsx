import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import ListHeader, { ListActions } from './list-header';
import DynamicList from './dynamic-list';
import PaginatedList from './paginated-list';

export type ListViewProps = {
	list: List;
	items: ListItemData[];
	page?: number;
	Header?: React.ReactNode;
};

// TODO: ListView definitely needs some refactoring
export default function ListView(props: ListViewProps) {
	const actions: ListActions = {
		canPlay: true,
		canEdit: true,
		canAddItems: true,
		canDelete: true,
	};
	const Header = props.Header || (
		<ListHeader list={props.list} actions={actions} />
	);

	return (
		<>
			<noscript className={`mx-auto block max-w-7xl`}>
				{Header}
				<PaginatedList
					list={props.list}
					items={props.items}
					page={props.page}
				/>
			</noscript>

			<DynamicList
				list={props.list}
				items={props.items}
				page={props.page}
				Header={Header}
			/>
		</>
	);
}
