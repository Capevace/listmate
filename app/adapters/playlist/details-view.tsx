import { GroupType, ResourceType, Song } from '~/models/resource/types';
import CollectionDetailsView, {
	CollectionDetailsProps,
} from '~/adapters/collection/details-view';
import PlayButton from '~/components/resource/play-button';
import findPreferredRemote from '~/utilities/preferred-remote';
import { PlayableTrack, PlayerContext, Queue } from '~/components/player/types';

type PlaylistDetailsProps = CollectionDetailsProps<Song, ResourceType.PLAYLIST>;

export default function PlaylistDetailsView(props: PlaylistDetailsProps) {
	const queue: Queue = props.details.items
		.map((song) => {
			const remote = findPreferredRemote(song.remotes, GroupType.MUSIC);

			return remote
				? ({
						resource: song,
						type: remote.type,
						uri: remote.uri,
				  } as PlayableTrack)
				: null;
		})
		.filter((track) => !!track) as PlayableTrack[];

	const track = queue[0];
	const context: PlayerContext = {
		resource: props.resource,
		queue,
		position: 0,
	};

	return (
		<CollectionDetailsView
			{...props}
			actions={track && <PlayButton track={track} playContext={context} />}
		/>
	);
}
