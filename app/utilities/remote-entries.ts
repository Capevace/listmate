import { Resource, SourceType } from '~/models/resource/types';

export default function remotesToEntries(remotes: Resource['remotes']) {
	return (Object.entries(remotes) as [SourceType, string][]).map((remote) => ({
		type: remote[0],
		uri: remote[1],
	}));
}
