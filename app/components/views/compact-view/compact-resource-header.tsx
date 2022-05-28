import { Download } from 'react-bootstrap-icons';
import { Link } from 'remix';
import { useState, useRef } from 'react';
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
import CompactView from './compact';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

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

	const [title, setTitle] = useState(resource.title);

	const [editingTitle, setEditingTitle] = useState(false);
	const timer = useRef();

	const onClickHandler = (event) => {
        if (event.detail === 2) {
            setEditingTitle(() => !editingTitle);
        }
    };

    const schema = zod.object({
		name: zod.string().min(1, { message: 'Required' }),
		age: zod.number().min(10),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	return (
		<CompactView
			parentRef={parentRef}
			resource={resource}
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
