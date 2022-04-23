import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import BaseRow from './rows/base-row';
import { PropsWithChildren } from 'react';
import { Link } from 'remix';
import { usePagination } from '@mantine/hooks';
import paginate, { pageSize } from '~/utilities/paginate';

const PageLink = ({
	page,
	active,
}: PropsWithChildren<{ page: number | 'dots'; active: boolean }>) =>
	page === 'dots' ? (
		<div className="text-gray-600">...</div>
	) : (
		<Link
			to={`?page=${page}`}
			className={` ${
				active
					? 'cursor-default text-blue-500'
					: 'text-gray-400 hover:text-gray-200'
			}`}
			aria-disabled={active}
		>
			{page}
		</Link>
	);

export type PaginatedListPops = {
	list: List;
	items: ListItemData[];
	page?: number;
};

// TODO: Bundle optimization – Here we could bundle split the different type of lists
export default function PaginatedList({
	list,
	items,
	page,
}: PaginatedListPops) {
	const currentPage = page || 1;
	const pagination = usePagination({
		total: Math.ceil(items.length / pageSize),
		page: currentPage,
		siblings: 7,
	});
	const { skip, take } = paginate(currentPage);
	const paginatedItems = items.slice(skip, skip + take);

	return (
		<>
			<ul>
				{paginatedItems.map((item, index) => (
					<BaseRow
						key={item.id}
						list={list}
						item={item}
						index={index}
						style={{}}
					/>
				))}
			</ul>
			<footer className="mt-5 flex justify-center">
				<nav className="flex gap-2">
					{pagination.range.map((page) => (
						<PageLink key={page} page={page} active={currentPage === page} />
					))}
				</nav>
			</footer>
		</>
	);
}
