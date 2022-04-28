import type { DataObjectRemote, User } from '@prisma/client';
import type { ProgressFunction } from '~/utilities/progress';
import {
	Resource,
	SourceType,
	ResourceWithoutDefaults,
	SOURCE_NAMES,
	sourceTypeToName,
} from '~/models/resource/types';

import {
	createResource,
	findResourceByRemoteUri,
	upsertResource,
} from '~/models/resource/resource.server';
import { saveFile } from '~/models/file.server';
import { ResourceType } from '~/models/resource/types';

import * as spotifyApi from './spotify.server';
import * as youtubeApi from './youtube.server';

import retry from '~/utilities/retry';
import capitalize from '~/utilities/capitalize';
import { findToken } from '~/models/source-token.server';

function logEvent(type: ResourceType, ...messages: string[]) {
	console.log(`IMPORT – Spotify – ${type}`, ...messages);
}

export async function importResourceData<RType extends Resource = Resource>(
	api: SourceType,
	uri: DataObjectRemote['uri'],
	data: ResourceWithoutDefaults<RType>
): Promise<RType> {
	logEvent(data.type, `Importing ${uri}`);

	let previousResource = await findResourceByRemoteUri(api, uri);

	if (previousResource) {
		return (await upsertResource({
			...previousResource,
			...data,
		})) as RType;
	}

	const createdResource = await createResource(data);
	// await attachRemoteUri(createdResource.id, SourceType.SPOTIFY, uri);

	return createdResource as RType;
}

export async function importImage(url: string, name: string) {
	try {
		const res = await fetch(url);
		const buffer = await res.arrayBuffer();

		return saveFile(name, Buffer.from(buffer));
	} catch (e) {
		console.error('Error importing image', e);
		return null;
	}
}

export function retryImport<T>(fn: () => Promise<T>) {
	return retry(fn, 5);
}

export type ImportParameters<APIType extends ImportAPI> = {
	api: APIType;
	userId: User['id'];
	progress?: ProgressFunction;
};

// interface SourceAPI<TImportAPI extends ImportAPI, TokenData> {
// 	createApi(): TImportAPI;

// 	authenticateApi(
// 		api: TImportAPI,
// 		parameters: ApiAuthenticationParameters<TokenData>
// 	): Promise<TImportAPI>;

// 	importResourceWithType(
// 		parameters: ResourceImportParameters<TImportAPI>
// 	): Promise<Resource>;
// }

export type ImportAPI<
	TSourceType extends SourceType = SourceType,
	APIType = unknown
> = {
	type: TSourceType;
	authenticated: boolean;
	service: APIType;
};

export type ApiAuthenticationParameters<TokenData> = {
	userId: User['id'];
	tokenData: TokenData;
	tokenExpiresAt: Date | null;
};

export async function composeAuthenticatedApi(
	userId: User['id'],
	sourceType: SourceType
): Promise<ImportAPI | null> {
	const token = await findToken(userId, sourceType);

	if (!token || !token.data) {
		return null;
	}

	const parameters: ApiAuthenticationParameters<unknown> = {
		userId,
		tokenExpiresAt: token.expiresAt,
		tokenData: JSON.parse(token.data),
	};

	switch (sourceType) {
		case SourceType.SPOTIFY:
			return spotifyApi.authenticateApi(
				spotifyApi.createApi(),
				parameters as ApiAuthenticationParameters<spotifyApi.SpotifyTokenData>
			);

		case SourceType.YOUTUBE:
			return youtubeApi.authenticateApi(
				youtubeApi.createApi(),
				parameters as ApiAuthenticationParameters<youtubeApi.YouTubeTokenData>
			);

		default:
			throw new Error(`API not implemented: ${sourceType}`);
	}
}

export type ResourceImportParameters<TImportAPI extends ImportAPI = ImportAPI> =
	{
		api: TImportAPI;
		userId: User['id'];
		progress?: ProgressFunction;
		sourceType: SourceType;
		resourceType: ResourceType;
		uri: string;
	};

export async function importResourceWithType(
	parameters: ResourceImportParameters
) {
	switch (parameters.sourceType) {
		case SourceType.SPOTIFY:
			return spotifyApi.importResourceWithType(
				parameters as ResourceImportParameters<spotifyApi.API>
			);

		case SourceType.YOUTUBE:
			return youtubeApi.importResourceWithType(
				parameters as ResourceImportParameters<youtubeApi.API>
			);

		default:
			throw new Error(`Unsupported API type ${parameters.sourceType}`);
	}
}

export function composeOauthUrl(
	sourceType: SourceType,
	userId: User['id'],
	state: string
) {
	switch (sourceType) {
		case SourceType.SPOTIFY:
			return spotifyApi.composeOauthUrl(userId, state);

		case SourceType.YOUTUBE:
			return youtubeApi.composeOauthUrl(userId, state);

		default:
			throw new Error(
				`${capitalize(sourceType)} does not support OAuth authentication`
			);
	}
}

export function handleOauthCallback(
	sourceType: SourceType,
	userId: User['id'],
	state: string
) {
	switch (sourceType) {
		case SourceType.SPOTIFY:
			return spotifyApi.handleOauthCallback(userId, state);

		default:
			throw new Error(
				`${capitalize(sourceType)} does not support OAuth authentication`
			);
	}
}
