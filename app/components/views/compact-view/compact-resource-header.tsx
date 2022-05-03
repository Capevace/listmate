import { useRef } from 'react';
import { Download, Spotify } from 'react-bootstrap-icons';
import { Link } from 'remix';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import { Resource, ValueRef } from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';
import composeCoverUrl from '~/utilities/cover-url';
import { composeResourceUrl } from '~/utilities/resource-url';
import GenericListView from '../generic-list-view';
import CompactView from './compact-view';

export type CompactResourceViewProps = {
	resource: Resource;
	actions?: JSX.Element;
	showCover?: boolean;
	parentRef?: React.RefObject<HTMLElement>;
	children?: JSX.Element | JSX.Element[];
};

export default function CompactResourceView({
	resource,
	actions,
	parentRef,
	showCover,
	children,
}: CompactResourceViewProps) {
	const values = resource.values as Record<string, ValueRef<any>>;

	return (
		<CompactView
			parentRef={parentRef}
			title={
				<>
					<div className="inline-flex items-center gap-3">
						<span>{resource.title}</span>
						{/* <span className="opacity-30">~</span> */}
						<span className="truncate text-gray-500 opacity-90 dark:text-gray-500">
							{values.description?.value}
						</span>
					</div>
				</>
			}
			subtitle={
				<>
					<div className="inline-flex items-center gap-4">
						<span className="text-xs font-bold uppercase opacity-60">
							{capitalize(resource.type)}
						</span>
						{Object.entries(resource.remotes).map(([sourceType, tags]) => (
							<Link
								key={sourceType}
								to={composeResourceUrl(resource, sourceType)}
								className="flex items-center text-xs font-bold uppercase opacity-40 hover:opacity-90"
							>
								<Spotify className="" size={15} />
							</Link>
						))}
					</div>
				</>
			}
			coverUrl={composeCoverUrl(resource)}
			showCover={showCover}
			actions={
				<>
					{actions}
					<InlineFavouriteButton resource={resource} />

					<Link to="download">
						<Download size={18} />
					</Link>
				</>
			}
		>
			{children}
		</CompactView>
	);
}
