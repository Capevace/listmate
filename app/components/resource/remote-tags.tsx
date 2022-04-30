import { Popover } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'remix';
import { Resource, SourceType } from '~/models/resource/types';

export type SourceTagProps = {
	resource: Resource;
	sourceType: SourceType;
	uri: string;
};

export function SourceTag({ resource, sourceType, uri }: SourceTagProps) {
	let className =
		'inline text-xs rounded-lg px-2 py-1 uppercase font-bold antialiased  ';

	switch (sourceType) {
		case SourceType.SPOTIFY:
			className += 'bg-green-700 text-green-200 hover:text-green-400';
			break;

		case SourceType.YOUTUBE:
			className += 'bg-red-700 text-red-200 hover:text-red-400';
			break;

		default:
			className += 'bg-gray-700 text-gray-300 hover:text-gray-500';
			break;
	}

	return (
		<Link to={`${sourceType}`} className={className}>
			{sourceType}
		</Link>
	);
}

export type RemoteTagsProps = {
	resource: Resource;
};

export default function RemoteTags({ resource }: RemoteTagsProps) {
	let remotesList = Object.entries(resource.remotes) as [SourceType, string][];

	return (
		<>
			{remotesList.map(([sourceType, uri]) => (
				<SourceTag
					key={sourceType}
					resource={resource}
					sourceType={sourceType}
					uri={uri}
				/>
			))}
		</>
	);
}
