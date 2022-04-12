import {
	Resource,
	ResourceType,
	ValueRef,
} from '~/models/resource/base/resource';
import capitalize from '~/utilities/capitalize';
import ResourceValueLabel from '../common/resource-value-label';

function GenericDetails({ resource }: { resource: Resource }) {
	const valueList = Object.entries(resource.values);

	return (
		<dl className="grid grid-cols-6">
			{valueList.map(([key, value]: [string, ValueRef<string> | null]) => (
				<div key={key} className="col-span-2">
					<dt className="text-sm font-medium text-gray-400">
						{capitalize(key)}
					</dt>
					<dd className="mt-1 text-lg  sm:col-span-2 sm:mt-0">
						<ResourceValueLabel valueRef={value} />
					</dd>
				</div>
			))}
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

export function ResourceHeader({ resource }: { resource: Resource }) {
	return (
		<div className="mb-5 flex items-start">
			<div className="flex-1 items-stretch">
				<div className="relative mb-5 flex flex-col">
					<h1 className="mb-2 text-4xl font-bold text-gray-100">
						{resource.title}
					</h1>
					<p className="text-xl text-gray-300">{capitalize(resource.type)}</p>
				</div>
				<nav className="flex items-end gap-3">
					{/* <Form method="post">
						<Button
							type="submit"
							color="pink"
							size="md"
							rightIcon={<PlayIcon className="w-7" />}
						>
							Play
						</Button>
					</Form>
					<Form method="post">
						<Button
							type="submit"
							color="gray"
							size="md"
							rightIcon={<PlusIcon className="w-6" />}
						>
							Add item to list
						</Button>
					</Form> */}
				</nav>
			</div>
			<aside
				className="relative aspect-square h-48 justify-end rounded-lg bg-cover bg-center shadow-lg"
				style={{
					backgroundImage: `url(${
						resource.thumbnail
							? `/media/${resource.thumbnail.id}`
							: `https://dummyimage.com/500x500/374151/d1d5db.png&text=%20%20%20%20%20%20${resource.id}`
					})`,
				}}
			></aside>
		</div>
	);
}

export default function ResourceViewer({ resource }: { resource: Resource }) {
	return (
		<div className="relative my-5 border border-gray-700 bg-gray-800 px-10 py-8 shadow-xl sm:overflow-hidden sm:rounded-2xl">
			<ResourceHeader resource={resource} />

			<ResourceDetails resource={resource} />
		</div>
	);
}
