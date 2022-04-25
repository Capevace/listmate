import ListHeader, { ListActions } from './list-header';
import DynamicList from './dynamic-list';
import PaginatedList from './paginated-list';
import { Resource } from '~/models/resource/types';

export type PositionedItem = {
	resource: Resource;
};

export type ListViewProps = {
	items: Resource[];
	page?: number;
	headerHeight?: number;
	header?: React.ReactNode;
	footerHeight?: number;
	footer?: React.ReactNode;
};

// TODO: ListView definitely needs some refactoring
export default function ListView(props: ListViewProps) {
	// const actions: ListActions = {
	// 	canPlay: true,
	// 	canEdit: true,
	// 	canAddItems: true,
	// 	canDelete: true,
	// };

	return (
		<>
			<noscript className={`mx-auto block max-w-7xl`}>
				{props.header}
				<PaginatedList items={props.items} page={props.page} />
			</noscript>

			<DynamicList
				items={props.items}
				page={props.page}
				header={props.header}
				headerHeight={props.headerHeight}
				footer={props.footer}
				footerHeight={props.footerHeight}
			/>
		</>
	);
}
