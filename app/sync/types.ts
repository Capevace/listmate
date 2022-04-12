export type SpotifyPlaylist = {
	collaborative: boolean;
	description: string | null;
	// followers: {
	// 	href: string | null;
	// 	total: number;
	// };

	href: string;
	id: string;
	images: Array<{
		height: number | null;
		url: string;
		width: number | null;
	}>;
	name: string;
	owner: {
		// displayName: string | null;
		// externalUrls: {
		// 	spotify: string;
		// };
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	public: boolean;
	tracks: {
		href: string;
		total: number;
	};
	type: string;
	uri: string;
};
