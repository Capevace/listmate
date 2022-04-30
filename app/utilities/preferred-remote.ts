import {
	GroupType,
	GROUP_SOURCE_MAP,
	Resource,
	SourceType,
} from '~/models/resource/types';

export default function findPreferredRemote(
	remotes: Resource['remotes'],
	group: GroupType
) {
	const types = GROUP_SOURCE_MAP[group];

	let preferredType: { type: SourceType; uri: string } | null = null;
	for (const type of types) {
		const uri = remotes[type];

		if (uri) {
			preferredType = { type, uri };
			break;
		}
	}

	return preferredType;
}
