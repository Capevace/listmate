import { Resource, ResourceType, GroupType } from '~/models/resource/types';
import type { LoaderFunction, MetaFunction } from 'remix';

import { json, useCatch, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { useRef } from 'react';

import { requireUserId } from '~/session.server';
import { findResourcesByType, paginateResources, FilterOperator, PaginatedResources } from '~/models/resource/resource.server';
import { stringToGroupTypeOptional } from '~/models/resource/group-type';
import { stringToResourceTypeOptional } from '~/models/resource/types';
import { findOptionalPageQuery } from '~/utilities/paginate';
import capitalize from '~/utilities/capitalize';

import composePageTitle from '~/utilities/page-title';
import CompactView from '~/components/views/compact-view/compact-view';
import GenericListView from '~/components/views/generic-list-view';
import type { ContextLoaderFunction } from '~/models/context';
import BaseRow from '~/components/views/rows/base-row';
import ErrorView from '~/components/views/error-view';

type LoaderData = {
	title: string;
	subtitle?: string;
	pagination: PaginatedResources;
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
	const resourceType = stringToResourceTypeOptional(params.resourceType);

	if (!groupType) {
		throw new Response('Not Found', { status: 404 });
	}

	if (!resourceType) {
		throw new Response('Not Found', { status: 404 });
	}

	const pagination = await paginateResources({
		filterBy: [
			{
				key: 'type',
				operator: FilterOperator.Equals,
				needle: resourceType
			}
		],
		slice: {
			page: 1,
			max: 20
		}
	});

	return json<LoaderData>({
		title: capitalize(resourceType) + 's',
		subtitle: `All ${resourceType}s in your ${groupType} library.`,
		pagination,
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
	const { pagination, title, subtitle } = useLoaderData<LoaderData>();
	const ref = useRef<HTMLElement>(null);

	return (
		<CompactView parentRef={ref} title={title} subtitle={subtitle}>
			<GenericListView
				size={pagination.resources.length}
				estimateHeight={(index) => 50}
				parentRef={ref}
			>
				{(index, row) => {
					invariant(row, 'Only JS-enabled supported for now');

					const resource = pagination.resources[index];

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

export function CatchBoundary() {
	const caught = useCatch();
	console.log('lol')

	if (caught.status === 404) {
		return (
			<ErrorView status={404} className="mt-20" />
		);
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}