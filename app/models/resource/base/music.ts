import { Repository } from '../repository';
import {
	CompleteDataObjectRemote,
	composeResourceBase,
	Resource,
	ResourceType,
	SourceType,
} from './resource';

export type ForceResourceType<T extends ResourceType> = {
	type: T;
};

export type ArtistData = {
	name: string;
};

export type Artist = Resource &
	ForceResourceType<ResourceType.ARTIST> &
	ArtistData;

export type AlbumData = {
	name: string;
	artist?: ArtistData;
};

export type Album = Resource &
	ForceResourceType<ResourceType.ALBUM> &
	AlbumData;

export type SongData = {
	name: string;
	artist?: ArtistData;
	album?: AlbumData;
};

export type Song = Resource & ForceResourceType<ResourceType.SONG> & SongData;

export function dataObjectToAlbum<ForcedSource extends SourceType>(
	remote: CompleteDataObjectRemote,
	values: Record<string, any>
) {
	if (!('name' in values)) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.ALBUM, ForcedSource>(remote),
		name: values.name,
	};
}

export type CreateAlbumParameters = AlbumData & {
	artist?: ArtistData | Artist;
};

export function dataObjectToAlbum(remote: CompleteDataObjectRemote): Album {
	const values = valueListToMap(remote.values);

	if (!values.has('name')) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.ALBUM, SourceType>(remote),
		// additional spotify-specific fields
		name: values.get('name'),
	};
}

export function dataObjectToArtist(
	remote: CompleteDataObjectRemote,
	values?: Map<string, any>
): Album {
	values = values ?? valueListToMap(remote.values);

	if (!values.has('name')) {
		throw new Error('Missing name');
	}

	return {
		...composeResourceBase<ResourceType.ALBUM, SourceType>(remote),
		// additional spotify-specific fields
		name: values.get('name'),
		artist: values.has('artist')
			? dataObjectToArtist(remote, values.get('artist'))
	};
}
