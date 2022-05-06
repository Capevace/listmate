import { Download } from 'react-bootstrap-icons';
import { Link } from 'remix';
import InlineFavouriteButton from '~/components/resource/inline-favourite-button';
import RefreshButton from '~/components/resource/refresh-button';
import {
	Resource,
	SourceType,
	SOURCE_ICONS,
	ValueRef,
	ValueType,
} from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';
import composeCoverUrl from '~/utilities/cover-url';
import { composeResourceUrl } from '~/utilities/resource-url';
import CompactView from './compact-view';

export type CompactResourceViewProps = {
	resource: Resource;
	actions?: JSX.Element;
	showCover?: boolean;
	parentRef?: React.RefObject<HTMLElement>;
	top?: JSX.Element;
	children?: JSX.Element;
};

export default function CompactResourceView({
	resource,
	actions,
	parentRef,
	showCover,
	top,
	children,
}: CompactResourceViewProps) {
	const values = resource.values;
	const description = values.description
		? (values.description as ValueRef<ValueType.TEXT>).value
		: null;

	return (
		<CompactView
			parentRef={parentRef}
			title={resource.title}
			subtitle={description}
			top={top}
			headerDetails={
				<>
					<span className="text-xs font-bold uppercase opacity-60">
						{capitalize(resource.type)}
					</span>
					{Object.entries(resource.remotes).map(([sourceType, tags]) => (
						<Link
							key={sourceType}
							to={composeResourceUrl(resource, sourceType)}
							className="flex w-4 items-center text-xs font-bold uppercase opacity-40 hover:opacity-90"
						>
							{SOURCE_ICONS[sourceType as SourceType]}
							{/* <Spotify className="" size={15} /> */}
						</Link>
					))}
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
					<RefreshButton resource={resource} />
				</>
			}
		>
			{children}
		</CompactView>
	);
}
