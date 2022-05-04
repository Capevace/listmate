import type { Resource } from '~/models/resource/types';
import type { ContextLoaderFunction } from '~/models/context';

import { useLoaderData, json, MetaFunction } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { searchResources } from '~/models/resource/resource.server';
import { findOptionalPageQuery } from '~/utilities/paginate';

import ListView from '~/components/views/list-view';
import composePageTitle from '~/utilities/page-title';
import Header from '~/components/views/header';

type LoaderData = {
	resources: Resource[];
	page?: number;
	searchString: string;
};

export const loader = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	await requireUserId(request, context);

	const url = new URL(request.url);
	const searchString = url.searchParams.get('text');

	invariant(searchString, 'A search string must be provided');

	const page = findOptionalPageQuery(request.url);

	const resources = await searchResources(searchString);

	return json<LoaderData>({ resources, page, searchString });
};

export const meta: MetaFunction = ({ data }) => {
	const { searchString } = data as LoaderData;
	return {
		title: composePageTitle(`Search for "${searchString}"`),
	};
};

export default function SearchPage() {
	const { resources, page, searchString } = useLoaderData<LoaderData>();

	return (
		<ListView
			items={resources}
			page={page}
			header={
				<Header
					title="Search results"
					subtitle={searchString}
					className="mx-auto max-w-7xl"
				/>
			}
			headerHeight={365}
		/>
	);
}
