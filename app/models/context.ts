import type {
	DataFunctionArgs,
	LoaderFunction,
} from '@remix-run/server-runtime';

export type LoadContext = {
	userId: string;
};

// a custom data function args type to use for loaders/actions
export type ContextLoaderFunction = Omit<DataFunctionArgs, 'context'> & {
	context: LoadContext;
};
