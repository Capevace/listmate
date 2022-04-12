import { Resource, ResourceType, SourceType } from '../base/resource';
import { Album, Artist, Song } from '../base/music';
import { valueListToMap } from '../adapters/remote';

export type SpotifyResource = Resource & {
	api: SourceType.SPOTIFY;
};

/* Spotify types */
export type SpotifyArtist = SpotifyResource & Artist;

export type SpotifyAlbum = SpotifyResource &
	Album & {
		artist?: SpotifyArtist;
	};

export type SpotifySong = SpotifyResource &
	Song & {
		album?: SpotifyAlbum;
		artist?: SpotifyArtist;
	};
