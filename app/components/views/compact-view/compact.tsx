import { useFetcher } from 'remix';
import { useRef, useEffect } from 'react';
import { Resource } from '~/models/resource/types';
import composeCoverUrl from '~/utilities/cover-url';
// import CompactHeader, { CompactHeaderProps } from './compact-header';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { composeShortResourceUrl } from '~/utilities/resource-url';

type CompactHeaderProps = {
	className?: string;
	padded?: boolean;
	resource: Resource;
	children?: JSX.Element | null;
	actions?: JSX.Element | null;
};

function Background({ src }: { src: string }) {
	return (
		<div className="absolute inset-0 overflow-hidden">
			<div
				className="absolute -top-10 -left-10 -right-10  h-52 overflow-hidden bg-cover blur-2xl filter"
				style={{
					backgroundImage: `url(${src})`,
				}}
			></div>
			<div className="absolute top-0 left-0 right-0 h-72 bg-gray-100 opacity-40 dark:bg-gray-900"></div>

			<div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
		</div>
	);
}

function Cover({ src, alt }: { src: string; alt?: string }) {
	return (
		<figure className="flex h-full w-12 flex-shrink-0 items-center overflow-hidden overflow-visible md:w-16 lg:w-20 xl:w-32 xl:flex-shrink">
			<img src={src} alt={alt} className="rounded shadow-lg " />
		</figure>
	);
}

export function Header(props: CompactHeaderProps) {
	const fetcher = useFetcher();

	const schema = zod.object({
		title: zod.string().min(1, { message: 'Required' }),
		description: zod.string().min(1).optional(),
	});

	const hasDescription = 'description' in props.resource.values;
	const coverUrl = composeCoverUrl(props.resource);
	const initialDescription =
		'description' in props.resource.values &&
		!Array.isArray(props.resource.values.description)
			? (props.resource.values.description?.value as string)
			: undefined;

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			title: props.resource.title,
			description: initialDescription,
		},
	});
	const formAction = composeShortResourceUrl(props.resource.id, 'update');

	useEffect(() => {
		setValue('title', props.resource.title);
	}, [props.resource.title]);

	useEffect(() => {
		setValue('description', initialDescription);
	}, [initialDescription]);

	return (
		<header
			className={`${props.className} flex w-full flex-col gap-5 ${
				props.padded ? 'pt-4 lg:pt-20' : 'md:pt-4'
			}`}
		>
			{coverUrl && <Background src={coverUrl} />}

			<div className="z-10 flex w-full items-end justify-between gap-5 text-gray-900 dark:text-gray-100">
				<Cover
					src={
						coverUrl ??
						'https://dummyimage.com/200x200/474c54/ffffff&text=+++++++++Cover+++++++'
					}
				/>

				<section className="flex flex-1 flex-col gap-1 font-medium">
					<fetcher.Form
						method="post"
						action={formAction}
						className="flex flex-col items-start justify-start "
						onSubmit={handleSubmit((data) => {
							(document.activeElement as HTMLInputElement | undefined)?.blur();

							fetcher.submit(
								data.description
									? { title: data.title, description: data.description }
									: { title: data.title },
								{ method: 'post', action: formAction }
							);
						})}
					>
						<h1 className="clamp-2 flex w-full flex-col !overflow-visible text-lg md:flex-row md:text-xl lg:text-2xl">
							<input
								defaultValue={props.resource.title}
								{...register('title')}
								id={props.resource.id + '-title-input'}
								className="w-full rounded bg-transparent py-0 font-medium outline-blue-500 focus:outline disabled:opacity-70"
								disabled={!!fetcher.submission}
							/>
						</h1>
						{/* <div className="opacity-30">~</div> */}
						{hasDescription && (
							<h2
								id={props.resource.id + '-description-input'}
								className="hidden w-full max-w-md flex-grow-0 !overflow-visible truncate text-xs text-gray-600 opacity-90 dark:text-gray-400 sm:text-sm md:block md:text-base lg:text-lg"
							>
								<input
									defaultValue={initialDescription}
									{...register('description')}
									className="w-full rounded bg-transparent py-0 font-medium outline-blue-500 focus:outline disabled:opacity-70"
									disabled={!!fetcher.submission}
								/>
							</h2>
						)}

						<button type="submit" className="hidden">
							Submit
						</button>
					</fetcher.Form>

					<section className="flex gap-4">{props.children}</section>
				</section>
				<nav className="z-10 flex items-center justify-end gap-4 text-gray-700 dark:text-gray-400">
					{props.actions}
				</nav>
			</div>
			<hr className="z-10 border-gray-700 border-opacity-20 dark:border-gray-600" />
		</header>
	);
}

export type CompactViewProps = CompactHeaderProps & {
	parentRef?: React.RefObject<HTMLElement>;
	headerDetails?: JSX.Element;
	top?: JSX.Element;
	children?: JSX.Element;
};

export default function CompactView(props: CompactViewProps) {
	return (
		<article
			className="flex max-h-screen w-full flex-col gap-3 overflow-x-hidden overflow-y-scroll px-4 lg:px-8"
			ref={props.parentRef}
		>
			{props.top && (
				<aside className="z-10 mx-auto w-full max-w-7xl pt-5">
					{props.top}
				</aside>
			)}
			<Header
				className="mx-auto w-full max-w-7xl"
				{...props}
				padded={props.padded ?? !props.top}
				children={props.headerDetails}
			></Header>
			<main className="z-10 mx-auto w-full max-w-7xl ">{props.children}</main>
		</article>
	);
}
