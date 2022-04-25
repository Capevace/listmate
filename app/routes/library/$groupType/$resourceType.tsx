import type { LoaderFunction } from 'remix';
import type { List } from '~/models/list.server';
import type { ListItemData } from '~/models/item.server';
import type { Resource } from '~/models/resource/types';

import { json, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourcesByType } from '~/models/resource/resource.server';
import { stringToGroupTypeOptional } from '~/models/resource/group-type';
import { stringToResourceTypeOptional } from '~/models/resource/types';
import { findOptionalPageQuery } from '~/utilities/paginate';
import capitalize from '~/utilities/capitalize';

import ListView from '~/components/views/list-view';
import ListHeader from '~/components/views/list-view/list-header';

type LoaderData = {
	list: List;
	items: ListItemData[];
	page?: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	invariant(params.groupType, 'Library not found');
	invariant(params.resourceType, 'Resource type not found');

	const groupType = stringToGroupTypeOptional(params.groupType);

	if (!groupType) {
		throw new Response('Not Found', { status: 404 });
	}

	const resourceType = stringToResourceTypeOptional(params.resourceType);

	if (!resourceType) {
		throw new Response('Not Found', { status: 404 });
	}

	const page = findOptionalPageQuery(request.url);

	const list: List = {
		id: '',
		title: capitalize(resourceType) + 's', // TODO: proper pluralization
		description: `All ${resourceType}s in your ${groupType} library.`,
		createdAt: new Date(),
		updatedAt: new Date(),
		userId,
		coverFileReferenceId: null,
	};

	const resources: Resource[] = await findResourcesByType(resourceType);
	const items: ListItemData[] = resources.map((resource) => ({
		id: resource.id,
		listId: list.id,
		resource,
		position: -1,
	}));

	return json<LoaderData>({ list, items, page });
};

export default function ListPage() {
	const data = useLoaderData<LoaderData>();

	const resources = data.items.map((item) => item.resource);

	return (
		<ListView
			items={resources}
			page={data.page}
			header={<ListHeader list={data.list} />}
		/>
	);
}
