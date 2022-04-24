import type { Resource } from '~/models/resource/types';
import type { List } from '~/models/list.server';
import type { ListItemData } from '~/models/item.server';

import { LoaderFunction, useLoaderData, json } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { searchResources } from '~/models/resource/resource.server';
import { findOptionalPageQuery } from '~/utilities/paginate';

import ListView from '~/components/views/list-view';

type LoaderData = {
	resources: Resource[];
	page?: number;
	searchString: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await requireUserId(request);

	const url = new URL(request.url);
	const searchString = url.searchParams.get('text');

	invariant(searchString, 'A search string must be provided');

	const page = findOptionalPageQuery(request.url);

	const resources = await searchResources(searchString);

	return json<LoaderData>({ resources, page, searchString });
};

export default function SearchPage() {
	const { resources, page, searchString } = useLoaderData<LoaderData>();
	const list: List = {
		id: 'search',
		title: 'Search results',
		description: searchString,
		userId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		coverFileReferenceId: null,
	};

	const items: ListItemData[] = resources.map((resource) => ({
		id: resource.id,
		listId: list.id,
		resource,
		position: -1,
	}));

	return <ListView list={list} items={items} page={page} />;
}
