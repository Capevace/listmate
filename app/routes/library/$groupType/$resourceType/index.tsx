import type { LoaderFunction, MetaFunction } from 'remix';
import { Resource, ResourceType } from '~/models/resource/types';

import { json, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/session.server';
import { findResourcesByType } from '~/models/resource/resource.server';
import { stringToGroupTypeOptional } from '~/models/resource/group-type';
import { stringToResourceTypeOptional } from '~/models/resource/types';
import { findOptionalPageQuery } from '~/utilities/paginate';
import capitalize from '~/utilities/capitalize';

import composePageTitle from '~/utilities/page-title';
import CompactView from '~/components/views/compact-view/compact-view';
import GenericListView from '~/components/views/generic-list-view';
import { useRef } from 'react';
import type { ContextLoaderFunction } from '~/models/context';
import BaseRow from '~/components/views/rows/base-row';

type LoaderData = {
	title: string;
	subtitle?: string;
	resources: Resource[];
	page?: number;
};

export const loader: LoaderFunction = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	await requireUserId(request, context);

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

	const resources: Resource[] = await findResourcesByType(resourceType);

	return json<LoaderData>({
		title: capitalize(resourceType) + 's',
		subtitle: `All ${resourceType}s in your ${groupType} library.`,
		resources,
		page,
	});
};

export const meta: MetaFunction = ({ data }) => {
	if (!data) {
		return {};
	}

	const { title } = data as LoaderData;

	return {
		title: composePageTitle(`All ${title}`),
	};
};

export default function ListPage() {
	const { resources, title, subtitle } = useLoaderData<LoaderData>();
	const ref = useRef<HTMLElement>(null);

	return (
		<CompactView parentRef={ref} title={title} subtitle={subtitle}>
			<GenericListView
				size={resources.length}
				estimateHeight={(index) => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const resource = resources[index];

					const isMasonry = false && resource.type === ResourceType.ALBUM;

					return (
						<BaseRow
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
