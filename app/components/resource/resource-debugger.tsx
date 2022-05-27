import type { SetOptional } from 'type-fest';
import type { ResourceDetailsProps } from '~/models/resource/types';

type ResourceDebuggerProps = SetOptional<
	ResourceDetailsProps,
	'resource' | 'details'
> & {
	className?: string;
};

export default function ResourceDebugger({
	resource,
	details,
	className,
}: ResourceDebuggerProps) {
	return (
		<details className={className}>
			<summary className="cursor-pointer text-theme-400">Raw Info</summary>

			<div className="mt-5 grid grid-cols-2">
				<section className="col-span-1 overflow-x-scroll">
					<h2 className="mb-2 text-sm font-bold text-theme-500">Resource</h2>
					{resource ? (
						<pre className="font-mono text-theme-300">
							{JSON.stringify(resource, null, 2)}
						</pre>
					) : (
						<p className="font-italic text-theme-600">No resource</p>
					)}
				</section>
				<section className="col-span-1 overflow-x-scroll">
					<h2 className="mb-2 text-sm font-bold text-theme-500">Details</h2>
					{details ? (
						<pre className="font-mono text-theme-300">
							{JSON.stringify(details, null, 2)}
						</pre>
					) : (
						<p className="font-italic text-theme-600">No details</p>
					)}
				</section>
			</div>
		</details>
	);
}
