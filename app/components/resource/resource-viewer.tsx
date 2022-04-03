import { Resource, ResourceType } from '~/models/resource/base/resource';
import capitalize from '~/utilities/capitalize';

function GenericDetails({ resource }: { resource: Resource }) {
	return (
		<dl>
			<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Full name</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
					Margot Foster
				</dd>
			</div>
			<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Application for</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
					Backend Developer
				</dd>
			</div>
			<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Email address</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
					margotfoster@example.com
				</dd>
			</div>
			<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">
					Salary expectation
				</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
					$120,000
				</dd>
			</div>
			<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">About</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
					Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt
					cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.
					Sit id mollit nulla mollit nostrud in ea officia proident. Irure
					nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
				</dd>
			</div>
		</dl>
	);
}

function ResourceDetails({ resource }: { resource: Resource }) {
	switch (resource.type) {
		case ResourceType.SONG:
		default:
			return <GenericDetails resource={resource} />;
	}
}

export default function ResourceViewer({ resource }: { resource: Resource }) {
	return (
		<div className="overflow-hidden bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					{resource.title}
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					{capitalize(resource.type)}
				</p>
			</div>
			<div className="border-t border-gray-200">
				<ResourceDetails resource={resource} />
			</div>
		</div>
	);
}
