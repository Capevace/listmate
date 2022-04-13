import { Button } from '@mantine/core';
import { Link, LoaderFunction, useLoaderData, json, Outlet } from 'remix';
import capitalize from '~/utilities/capitalize';
import { requireUserId } from '~/session.server';
import { findTokens, SourceToken } from '~/models/source-token.server';
import {
	ALL_SOURCE_TYPES,
	SourceType,
	stringToSourceType,
} from '~/models/resource/resource.server';

type Token = {
	id: SourceToken['id'];
	expiresAt: Date | null;
};

type TokenData = {
	[key: string]: {
		type: SourceType;
		token: Token | null;
	};
};

type LoaderData = {
	tokens: TokenData;
	activeType?: SourceType;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const userId = await requireUserId(request);

	let data: LoaderData = {
		activeType: !params.api ? undefined : stringToSourceType(params.api),
		tokens: ALL_SOURCE_TYPES.reduce((all, type) => {
			all[type] = {
				type: stringToSourceType(type),
				token: null,
			};
			return all;
		}, {} as TokenData),
	};

	const tokens = await findTokens(userId);

	for (const token of tokens) {
		if (token && token.data) {
			let tokenData = {
				id: token.id,
				api: token.api,
				expiresAt: token.expiresAt || null,
			};

			data.tokens[token.api].token = tokenData;
		}
	}

	return json<LoaderData>(data);
};

function ConnectRow({
	type,
	token,
	active,
}: {
	type: SourceType;
	token: Token | null;
	active?: boolean;
}) {
	return (
		<div className="flex flex-col rounded-xl border border-gray-800  px-5 py-3">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-3">
					<h1 className="text-xl font-bold">{capitalize(type)} Settings</h1>
					{active ? <Outlet /> : null}
				</div>

				<div className="grid grid-cols-3 items-center justify-end gap-4 font-semibold text-gray-400">
					{token ? (
						<>
							<span className="text-xs opacity-0 xl:opacity-100">
								{capitalize(type)} is configured ✅
							</span>
							<Link
								to={`/connections/${type}/import`}
								className="col-span-1 block"
							>
								<Button
									type="submit"
									variant={'light'}
									fullWidth={true}
									size="xs"
								>
									Import
								</Button>
							</Link>
							<Link
								to={`/connections/${type}/unlink`}
								className="col-span-1 block"
							>
								<Button
									type="submit"
									variant={'light'}
									fullWidth={true}
									color="red"
									size="xs"
								>
									Unlink
								</Button>
							</Link>
						</>
					) : (
						<Link
							to={`/connections/${type}`}
							className="col-span-1 col-start-3 block"
						>
							<Button
								type="submit"
								size="xs"
								fullWidth={true}
								disabled={type !== SourceType.SPOTIFY}
							>
								Authorize
							</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}

export default function ConnectIndexPage() {
	const { tokens, activeType } = useLoaderData() as LoaderData;

	return (
		<div className="flex flex-col gap-5 px-10 py-8">
			<h1>Connections</h1>
			<div className="flex flex-col gap-8">
				{Object.keys(tokens).map((type) => {
					const token = tokens[type];

					return (
						<ConnectRow
							key={token.type}
							type={token.type}
							token={token.token}
							active={type === activeType}
						/>
					);
				})}
			</div>
		</div>
	);
}
