export const pageSize = 50;

export type PaginateResult = {
	skip?: number;
	take?: number;
};

export function findOptionalPageQuery(urlString: string) {
	const url = new URL(urlString);
	const pageQuery = url.searchParams.get('page');

	return pageQuery ? Math.max(0, parseInt(pageQuery, 10)) : undefined;
}

export default function paginate(page?: number) {
	return page
		? {
				skip: (page - 1) * pageSize,
				take: pageSize,
		  }
		: { skip: 0, take: pageSize };
}
