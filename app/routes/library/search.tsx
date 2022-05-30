import { Resource, ResourceType } from '~/models/resource/types';
import type { ContextLoaderFunction } from '~/models/context';

import { useLoaderData, json, MetaFunction } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { searchResources } from '~/models/resource/resource.server';
import { findOptionalPageQuery } from '~/utilities/paginate';

import composePageTitle from '~/utilities/page-title';
import CompactView from '~/components/views/compact-view/compact-view';
import { useRef } from 'react';
import GenericListView from '~/components/views/generic-list-view';
import ResourceRow from '~/components/views/rows/ResourceRow';

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
	const ref = useRef<HTMLElement>(null);
	const { resources, searchString } = useLoaderData<LoaderData>();

	return (
		<CompactView
			parentRef={ref}
			title={'Search results'}
			subtitle={searchString ? `${resources.length} items found` : ''}
		>
			<GenericListView
				size={resources.length}
				estimateHeight={() => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const resource = resources[index];

					const isMasonry = false && resource.type === ResourceType.ALBUM;

					return (
						<ResourceRow
							key={`${resource.id}-${index}`}
							measureRef={row.measureRef}
							resource={resource}
							style={
								row
									? {
											...(isMasonry
												? {
														width: '20%',
														// height: `${row.size}px`,
														transform: `translateY(${row.start % 5}px)`,
												  }
												: {
														position: 'absolute',
														top: 0,
														left: 0,
														width: '100%',
														transform: `translateY(${row.start}px)`,
												  }),
									  }
									: { position: 'relative' }
							}
						/>
					);
				}}
			</GenericListView>
		</CompactView>
	);
}
