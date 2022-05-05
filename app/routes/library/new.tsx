import { useRef } from 'react';
import { Form, useFetcher } from 'remix';
import CompactView from '~/components/views/compact-view/compact-view';

type LoaderData = {};

export default function NewEntryPage() {
	const parentRef = useRef<HTMLElement>(null);

	const fetcher = useFetcher<LoaderData>();

	return (
		<CompactView
			parentRef={parentRef}
			title={'Add new resource'}
			subtitle={'Import a resource or create a new one'}
			disableTopPadding
		>
			<>
				<section>
					<fetcher.Form method="post" action="search">
						<input
							type="text"
							placeholder="Search..."
							className="w-full rounded border border-gray-600 bg-gray-700 px-5 py-2 text-gray-200 shadow-lg focus:border-gray-500 focus:outline-none"
						/>
					</fetcher.Form>
					<Form className="mb-4"></Form>

					<ul>
						<li></li>
					</ul>
				</section>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore,
					temporibus dignissimos consectetur dicta eum itaque quasi tempore
					explicabo, mollitia voluptatibus maiores. Molestiae cum, repellendus
					dolores temporibus odit tempora incidunt et?
				</p>
			</>
		</CompactView>
	);
}
