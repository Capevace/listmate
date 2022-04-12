import {
	Resource,
	ResourceType,
	SourceType,
} from '~/models/resource/base/resource';

type ImportResult = {
	resource: Resource;
	other?: Resource[]; // resources like albums and playlists also import contained songs
};

type UpdateResult = {
	resource: Resource;
	other?: Resource[]; // resources like albums and playlists also import contained songs
};

type ExternalList = {
	id: string;
	name: string;
};

type CollectionImportTask = {};

interface ExternalService {
	importResource(uri: string, type: ResourceType): Promise<ImportResult>;
	// import data ABOUT a single resource
	// e.g.
	// - import a single song
	// - import a single album (WITHOUT contained songs)

	fetchAvailableCollections(): Promise<ExternalList[]>;
	// Returns
	// - spotify: all available playlists
	// - youtube: all available playlists

	/**
	 * Import a collection of resources.
	 *
	 * Results are not returned immediately, and a task is created instead.
	 * Some external services may have rate limits, so the task may not be
	 * completed immediately.
	 *
	 * Maybe this should be moved into its own module?
	 */
	importCollection(id: string): Promise<CollectionImportTask>;
}

/**
	 ================================================================================
	ENDPOINTS
	================================================================================

	These are the endpoints that are used to communicate with the external services.

	MUSIC:
		Spotify:
			https://developer.spotify.com/documentation/web-api/reference/

			Exposed resources:
				- Playlists
				- Albums
				- Tracks
				- Artists

		YouTube:
			https://developers.google.com/youtube/v3/docs/

			Exposed resources:
				- Playlists
				- Videos
				- Channels

		Deezer:
			https://developers.deezer.com/api/

			Exposed resources:
				- Playlists
				- Albums
				- Tracks
				- Artists

		SoundCloud:
			https://developers.soundcloud.com/docs/api/guide

			Exposed resources:
				- Playlists
				- Tracks
				- Users/Artists

	Bookmarks (browser):
		Firefox:
			https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks

			Exposed resources:
				- Bookmarks
				- History
				
		Pocket:
			https://getpocket.com/developer/docs/v3/

			Exposed resources:
				- Unread items
				- Tags

	Firefox Sync:
	https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Sync/WebExtensions

	================================================================================
 */

export class SpotifyService implements ExternalService {
	fetchAvailableCollections(): Promise<ExternalList[]> {
		throw new Error('Method not implemented.');
	}
	importCollection(id: string): Promise<CollectionImportTask> {
		throw new Error('Method not implemented.');
	}
	importResource(uri: string, type: ResourceType): Promise<ImportResult> {
		return Promise.resolve({
			resource: {
				id: '1',
				uri: '2',
				title: '3',
				type: ResourceType.SONG,
				api: SourceType.SPOTIFY,
				values: {},
			},
			other: [],
		});
	}

	updateResource(resource: Resource): Promise<void> {
		return Promise.resolve();
	}
}
