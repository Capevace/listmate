import type { ResourceType, Song } from '~/models/resource/types';
import CollectionDetailsView, {
	CollectionDetailsProps,
} from '~/adapters/collection/details-view';

type PlaylistDetailsProps = CollectionDetailsProps<Song, ResourceType.PLAYLIST>;

export default function PlaylistDetailsView(props: PlaylistDetailsProps) {
	return <CollectionDetailsView {...props} />;
}
