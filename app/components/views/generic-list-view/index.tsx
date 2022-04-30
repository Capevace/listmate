import type { Resource } from '~/models/resource/types';
import GenericDynamicList from './dynamic-list';
import { VirtualItem } from 'react-virtual';
import GenericPaginatedList from './paginated-list';

export type PositionedItem = {
	resource: Resource;
};

export type GenericListViewProps = {
	size: number;
	page?: number;
	estimateHeight: (index: number) => number;
	children: (index: number, item?: VirtualItem) => JSX.Element;
};

export default function GenericListView(props: GenericListViewProps) {
	return (
		<div>
			<noscript className={`mx-auto block w-full max-w-7xl`}>
				<GenericPaginatedList
					size={props.size}
					page={props.page}
					render={props.children}
				/>
			</noscript>

			<GenericDynamicList
				size={props.size}
				page={props.page}
				render={props.children}
				estimateHeight={props.estimateHeight}
			/>
		</div>
	);
}
