import { SearchIcon } from '@heroicons/react/solid';
import { Drawer, Input, Button, Loader } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import {
	ActionFunction,
	Form,
	json,
	LoaderFunction,
	MetaFunction,
	useFetcher,
	useLoaderData,
	useNavigate,
	useTransition,
} from 'remix';
import {
	composeAuthenticatedApi,
	ResourceSearchResult,
	searchForResourceWithType,
} from '~/apis/apis.server';
import { attachRemoteUri } from '~/models/resource/resource.server';
import { Resource, SourceType, SOURCE_NAMES } from '~/models/resource/types';
import { requireUserId } from '~/session.server';
import { useDebounce } from '~/utilities/hooks/use-debounce';
import httpFindResource from '~/utilities/http/find-resource';
import httpFindSourceType from '~/utilities/http/find-source-type';
import composePageTitle from '~/utilities/page-title';
import type { ContextLoaderFunction } from '~/models/context';

export type LoaderData = {
	resource: Resource;
	sourceType: SourceType;
	searchResults: ResourceSearchResult[];
};

export const loader: LoaderFunction = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	const userId = await requireUserId(request, context);
	const sourceType = httpFindSourceType(params.sourceType);
	const resource = await httpFindResource(params.resourceId);
	const api = await composeAuthenticatedApi(userId, sourceType);

	if (!api) {
		throw new Response(`User not connected with ${SOURCE_NAMES[sourceType]}`, {
			status: 401,
		});
	}

	const url = new URL(request.url);
	const searchText = url.searchParams.get('search');
	const searchResults = searchText
		? await searchForResourceWithType({
				api,
				userId,
				sourceType,
				resourceType: resource.type,
				search: searchText,
		  })
		: [];

	return json<LoaderData>({
		resource,
		sourceType,
		searchResults,
	});
};

export const action: ActionFunction = async ({ request, params }) => {
	const sourceType = httpFindSourceType(params.sourceType);
	const resource = await httpFindResource(params.resourceId);

	const formData = await request.formData();
	const uri = formData.get('uri');

	if (!uri) {
		throw new Response('No URI provided', {
			status: 400,
		});
	}

	await attachRemoteUri(resource.id, sourceType, uri.toString());

	return null;
};

export const meta: MetaFunction = ({ data, parentsData }) => {
	if (!data) {
		// If routes/resources/$resourceId is not in the parentsData, the resource itself was not found
		const errorType = parentsData['routes/resources/$resourceId']
			? 'Source'
			: 'Resource';

		return { title: composePageTitle(`${errorType} not found`) };
	}

	const { resource } = data as LoaderData;

	return {
		title: composePageTitle(resource.title),
	};
};

export default function ResourceSourceView() {
	const transition = useTransition();
	const fetcher = useFetcher<LoaderData>();
	const navigate = useNavigate();
	const data = useLoaderData<LoaderData>();
	const { resource, sourceType, searchResults } = data;
	console.log(data);
	const uri = resource.remotes[sourceType];

	const findResources: ChangeEventHandler<HTMLInputElement> = (e) => {
		fetcher.submit({ search: e.target.value });
	};
	const findResourcesDebounced = useDebounce(
		findResources,
		500
	) as ChangeEventHandler<HTMLInputElement>;

	return (
		<Drawer
			opened={true}
			position={'right'}
			onClose={() => navigate(-1)}
			title={
				<h2 className="text-2xl font-medium antialiased">
					Connection to {SOURCE_NAMES[sourceType]}
				</h2>
			}
			padding="xl"
			size="xl"
			className="overflow-y-scroll"
		>
			<dl className="">
				<dt className="flex w-full items-center justify-between gap-2 text-sm font-bold text-gray-400">
					URI
					{uri && (
						<fetcher.Form method="post" action="disconnect">
							<Button variant="subtle" size="sm" color="red" compact>
								Disconnect
							</Button>
						</fetcher.Form>
					)}
				</dt>
				<dd className="mt-1 text-gray-300 sm:col-span-2 sm:mt-0">
					<pre>{uri || 'No URI available'}</pre>
				</dd>
			</dl>

			<hr className="my-5 border-gray-700" />
			<Form className="mb-4">
				<Input
					placeholder="Search..."
					icon={<SearchIcon className="w-4" />}
					className="w-full"
					name="search"
					variant="default"
					size="xs"
					onChange={findResourcesDebounced}
				/>
			</Form>

			<ul className="flex flex-col gap-2 ">
				{fetcher.state !== 'idle' && (
					<li className="my-2 flex justify-center">
						<Loader />
					</li>
				)}
				{(fetcher.data?.searchResults || searchResults).map((result) => (
					<li
						key={result.uri}
						className="grid grid-cols-8 items-center gap-2 rounded bg-gray-900 p-1 pr-4"
					>
						<figure className="col-span-1 ">
							<img
								src={result.thumbnailUrl ?? ''}
								alt={`${result.title} cover`}
								loading="lazy"
								className="aspect-square rounded"
							/>
						</figure>
						<section className="col-span-5 text-xs text-gray-200">
							<h3 className="font-bold">{result.title}</h3>
							<span className="">{result.subtitle ?? ''}</span>
						</section>
						<section className="col-span-2 flex items-center justify-end">
							<Form method="post" replace>
								<input type="hidden" name="uri" value={result.uri} />
								<Button
									compact
									variant="default"
									type="submit"
									disabled={result.uri === uri}
									loading={
										!!transition.submission &&
										transition.submission?.formData.get('uri') === result.uri
									}
								>
									{result.uri === uri ? 'Selected' : 'Choose'}
								</Button>
							</Form>
						</section>
					</li>
				))}
			</ul>
		</Drawer>
	);
}
