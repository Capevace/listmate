import { PlayIcon } from '@heroicons/react/solid';
import RefreshButton from '~/components/resource/refresh-button';

export default function NewPage() {
	return (
		<article className="mx-auto flex w-full max-w-7xl flex-col gap-5 pt-20">
			<header className="flex w-full flex-col gap-4 ">
				<div
					className="absolute top-0 left-0 right-0  h-32 bg-cover blur-2xl filter"
					style={{
						backgroundImage:
							'url(http://localhost:3000/media/7a4b012b-0546-4732-a423-ce45e2e91f2a)',
					}}
				></div>
				<div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-gray-900"></div>

				<div className="z-10 flex w-full items-center justify-between">
					<section className="flex flex-1 flex-col font-medium text-gray-100">
						<h1>Page name</h1>
						<p className="text-sm text-gray-400">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</p>
					</section>
					<nav className="z-10 flex items-center justify-end text-gray-300">
						<button>
							<PlayIcon className="w-6" />
						</button>
						<RefreshButton resource={resource} />
					</nav>
				</div>
				<hr className="z-10 border-gray-400" />
			</header>
			<main className="z-10">
				<h2>Hello</h2>
			</main>
		</article>
	);
}
