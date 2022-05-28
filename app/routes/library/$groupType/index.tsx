import { LoaderFunction, redirect, useCatch } from 'remix';
import ErrorView from '~/components/views/error-view';
import {
	GroupType,
	GROUP_SOURCE_MAP,
	stringToGroupTypeOptional,
} from '~/models/resource/group-type';
import findResource from '~/utilities/http/find-resource';
import { composeResourceUrl } from '~/utilities/resource-url';

export const loader: LoaderFunction = async ({ request, params }) => {
	const groupType = stringToGroupTypeOptional(params.groupType);

	switch (groupType) {
		case GroupType.BOOKMARKS:
			return redirect(`/library/${groupType}/bookmark`);
		case GroupType.VIDEOS:
			return redirect(`/library/${groupType}/video`);
		case GroupType.MUSIC:
		default:
			throw new Response('Not found', { status: 404 });
	}
};
