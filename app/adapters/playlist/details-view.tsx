import { GroupType, ResourceType, Song } from '~/models/resource/types';
import CollectionDetailsView, {
	CollectionDetailsProps,
} from '~/adapters/collection/details-view';
import findPreferredRemote from '~/utilities/preferred-remote';
import { PlayableTrack, PlayerContext, Queue } from '~/components/player/types';
import InlinePlayButton from '~/components/resource/inline-play-button';

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
			actions={
				track && (
					<>
						<InlinePlayButton
							resource={track.resource}
							sourceType={track.type}
							uri={track.uri}
							context={context}
						/>
						{/* <InlineQueueButton resource={props.resource} type={track.} /> */}
					</>
				)
			}
		/>
	);
}
