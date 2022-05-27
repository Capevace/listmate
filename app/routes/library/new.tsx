import { useRef, useState } from 'react';
import { Search } from 'react-bootstrap-icons';
import {
	Form,
	json,
	Link,
	useFetcher,
	useLoaderData,
	useLocation,
	useTransition,
	useNavigate,
} from 'remix';
import {
	composeAuthenticatedApi,
	ResourceSearchResult,
	searchForResource,
	GeneralSearchResults,
} from '~/apis/apis.server';
import TextInput from '~/components/forms/text-input';
import CompactView from '~/components/views/compact-view/compact-view';
import CompactButton from '~/components/forms/compact-button';
import { ContextLoaderFunction } from '~/models/context';
import {
	ResourceType,
	SourceType,
	stringToSourceTypeOptional,
	ALL_RESOURCE_TYPES,
	SOURCE_NAMES,
} from '~/models/resource/types';
import { requireUserId } from '~/session.server';

type LoaderData = {
	sourceType: SourceType;
	search: string;
	searchResults: GeneralSearchResults<ResourceType>[];
};

export const loader = async ({
	request,
	params,
	context,
}: ContextLoaderFunction) => {
	const userId = await requireUserId(request, context);
	const url = new URL(request.url);
	const sourceType =
		stringToSourceTypeOptional(url.searchParams.get('source')) ??
		SourceType.SPOTIFY;

	const api = await composeAuthenticatedApi(userId, sourceType);

	const search = url.searchParams.get('search');
	const searchResults =
		search && api
			? await searchForResource({
					api,
					userId,
					sourceTypes: [SourceType.SPOTIFY],
					resourceTypes: ALL_RESOURCE_TYPES,
					search: search,
			  })
			: [];

	return json<LoaderData>({
		sourceType,
		search: search ?? '',
		searchResults,
	});
};
/*{selectedData && <li className="grid grid-cols-12 items-center gap-4 rounded-md bg-theme-800 p-5 py-4 border border-theme-700">
										{selectedData.thumbnailUrl && (
											<figure className="col-span-2">
												<img
													src={selectedData.thumbnailUrl}
													alt={selectedData.title}
													className="w-full rounded-lg"
												/>
											</figure>
										)}
										<div className="col-span-10 flex flex-col gap-1">
											<div>
												<h3 className="font-bold dark:text-theme-100">
													{selectedData.title}
												</h3>
												<p className="text-sm dark:text-theme-400">
													{selectedData.subtitle}
												</p>
											</div>
											<pre className="text-sm dark:text-theme-400">
												{selectedData.uri}
											</pre>
										</div>
									</li>}*/
export default function NewEntryPage() {
	const parentRef = useRef<HTMLElement>(null);

	const location = useLocation();
	const transition = useTransition();
	const loaderData = useLoaderData<LoaderData>();
	const fetcher = useFetcher<LoaderData>();

	const selectedData: any | null = null;
	const data = fetcher.data ?? loaderData;
	const isLoadingSearchResults =
		transition.submission &&
		transition.submission.formData.get('search') !== data.search;
	const isLoadingUri = (buttonUri: string) => {
		const transitionUri = transition.submission?.formData.get('uri');

		return transitionUri === buttonUri && transitionUri !== data.uri;
	};

	return (
		<CompactView
			parentRef={parentRef}
			title={'Add new resource'}
			subtitle={'Import a resource or create a new one'}
		>
			<>
				<section>
					<Form
						method="get"
						className="flex flex-col gap-5"
						replace
						// onSubmit={e => fetcher.submit({ search: 'test' }, { method: 'get' })}
					>
						<input type="submit" hidden />

						<section className="w-full">
							<label htmlFor="source">
								Source
								<select
									name="source"
									className="w-full rounded border border-theme-600 bg-theme-700 px-5 py-2 text-theme-200 shadow-lg focus:border-theme-500 focus:outline-none"
									defaultValue={data.sourceType}
								>
									<option value="youtube">YouTube</option>
									<option value="spotify">Spotify</option>
								</select>
							</label>
						</section>

						<section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
							<div className="col-span-1 flex flex-col gap-2">
								<TextInput
									label={'Search'}
									name={'search'}
									left={
										<figure className="font-mono text-theme-500">
											<Search />
										</figure>
									}
									defaultValue={data.search}
									// onChange={e => setSearch(e.target.value)}
									loading={isLoadingSearchResults}
								/>
								<section className="grid grid-cols-1 sm:grid-cols-2">
									{data.searchResults &&
										data.searchResults.map((resourceResults) => {
											return (
												<>
													<h2>
														{resourceResults.resourceType} –{' '}
														{SOURCE_NAMES[resourceResults.sourceType]}
													</h2>
													<ul className="col-span-1 flex flex-col gap-2">
														{resourceResults.searchResults.map((result) => {
															const searchParams = new URLSearchParams(
																location.search
															);
															searchParams.set('uri', result.uri);

															console.log('hello', result);

															return (
																<li
																	key={result.uri}
																	className="grid grid-cols-12 items-center gap-2"
																>
																	{result.thumbnailUrl && (
																		<figure className="col-span-1">
																			<img
																				src={result.thumbnailUrl}
																				alt={result.title}
																				className="w-full rounded-lg"
																			/>
																		</figure>
																	)}
																	<div className="col-span-10">
																		<h3 className="font-medium dark:text-theme-100">
																			{result.title}
																		</h3>
																		<p className="text-sm dark:text-theme-400">
																			{result.subtitle}
																		</p>
																	</div>
																	<CompactButton
																		name="uri"
																		value={result.uri}
																		type="submit"
																		className="col-span-1"
																		loading={isLoadingUri(result.uri)}
																	>
																		Use
																	</CompactButton>
																</li>
															);
														})}
													</ul>
												</>
											);
										})}
								</section>
							</div>
						</section>
					</Form>
				</section>
			</>
		</CompactView>
	);
}
