import { useFetcher } from 'remix';
import { useRef } from 'react';
import { MergeExclusive } from 'type-fest';

export type CompactHeaderProps = {
	title: JSX.Element | string;
	onTitleChanged?: (title: string, event: Event) => void;
	subtitle?: JSX.Element | string | null;
	onSubtitleChanged?: (title: string, event: Event) => void;
	actions?: JSX.Element;
	details?: JSX.Element;
	coverUrl?: string | null;
	showCover?: boolean;
	disableTopPadding?: boolean;
	className?: string | null;
	children?: JSX.Element;
	editable?: boolean;
};

export default function CompactHeader({
	title,
	subtitle,
	actions,
	details,
	coverUrl,
	showCover,
	children,
	disableTopPadding,
	className,
	editable,
	onTitleChanged,
	onSubtitleChanged,
}: CompactHeaderProps) {
	const fetcher = useFetcher();
	const timeout = useRef();

	const debounceSave = (text: string, immediate: (text: string) => void) => {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}

		immediate(text);

		timeout.current = setTimeout(() => {
			// alert('test');
			fetcher.submit();
		}, 400);
	};

	const displayCover = showCover && coverUrl;

	return (
		<header
			className={`${className} flex w-full flex-col gap-5 ${
				disableTopPadding ? 'md:pt-4' : 'pt-4 lg:pt-20'
			}`}
		>
			{coverUrl && (
				<div className="absolute inset-0 overflow-hidden">
					<div
						className="absolute -top-10 -left-10 -right-10  h-52 overflow-hidden bg-cover blur-2xl filter"
						style={{
							backgroundImage: `url(${coverUrl})`,
						}}
					></div>
					<div className="absolute top-0 left-0 right-0 h-72 bg-theme-100 opacity-40 dark:bg-theme-900"></div>

					<div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-theme-50 dark:to-theme-900"></div>
				</div>
			)}
			<div className="z-10 flex w-full items-end justify-between gap-5 text-theme-900 dark:text-theme-100">
				{displayCover && (
					<figure className="flex h-full w-12 flex-shrink-0 items-center overflow-hidden overflow-visible md:w-16 lg:w-20 xl:w-32 xl:flex-shrink">
						<img src={coverUrl} alt="" className="rounded shadow-lg " />
					</figure>
				)}

				<section className="flex flex-1 flex-col gap-1 font-medium">
					{editable ? (
						<fetcher.Form
							method="post"
							action=""
							className="flex flex-col items-start justify-start "
						>
							<h1 className="clamp-2 flex w-full flex-col !overflow-visible text-lg md:flex-row md:text-xl lg:text-2xl">
								<input
									value={title}
									onChange={(e) => debounceSave(e.target.value, onTitleChanged)}
									className="w-full rounded bg-transparent py-0 font-medium outline-blue-500 focus:outline"
								/>
							</h1>
							{/* <div className="opacity-30">~</div> */}
							{subtitle && (
								<h2 className="hidden w-full max-w-md flex-grow-0 !overflow-visible truncate text-xs text-theme-600 opacity-90 dark:text-theme-400 sm:text-sm md:block md:text-base lg:text-lg">
									<input
										value={subtitle}
										onChange={(e) =>
											debounceSave(e.target.value, onSubtitleChanged)
										}
										className="w-full rounded bg-transparent py-0 font-medium outline-blue-500 focus:outline"
									/>
								</h2>
							)}

							<button type="submit" className="hidden">
								Submit
							</button>
						</fetcher.Form>
					) : (
						<section
							method="post"
							action=""
							className="flex flex-col items-start justify-start "
						>
							<h1 className="clamp-2 flex w-full flex-col !overflow-visible text-lg md:flex-row md:text-xl lg:text-2xl">
								{title}
							</h1>
							{/* <div className="opacity-30">~</div> */}
							{subtitle && (
								<div className="hidden w-full max-w-md flex-grow-0 !overflow-visible truncate text-xs text-theme-600 opacity-90 dark:text-theme-400 sm:text-sm md:block md:text-base lg:text-lg">
									{subtitle}
								</div>
							)}
						</section>
					)}

					<section className="flex gap-4">{children}</section>
				</section>
				<nav className="z-10 flex items-center justify-end gap-4 text-theme-700 dark:text-theme-400">
					{actions}
				</nav>
			</div>
			<hr className="z-10 border-theme-700 border-opacity-20 dark:border-theme-600" />
		</header>
	);
}
