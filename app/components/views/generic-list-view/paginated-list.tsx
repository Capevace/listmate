import { VirtualItem } from 'react-virtual';

export type GenericPaginatedListProps = {
	size: number;
	render: (index: number, item?: VirtualItem) => JSX.Element;
	page?: number;
};

export default function GenericPaginatedList(props: GenericPaginatedListProps) {
	// const currentPage = page || 1;
	// const pagination = usePagination({
	// 	total: Math.ceil(size / pageSize),
	// 	page: currentPage,
	// 	siblings: 7,
	// });
	// const { skip, take } = paginate(currentPage);

	return (
		<>
			{/* <ul>
				{new Array(Math.min(take, size))
					.fill(0)
					.map((item, index) => render(index + skip))}
			</ul>
			<footer className="mt-5 flex justify-center">
				<nav className="flex gap-2">
					{pagination.range.map((page) => (
						<PageLink key={page} page={page} active={currentPage === page} />
					))}
				</nav>
			</footer> */}
		</>
	);
}
