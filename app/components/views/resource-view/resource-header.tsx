import type { Resource } from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';

export default function ResourceHeader({ resource }: { resource: Resource }) {
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
