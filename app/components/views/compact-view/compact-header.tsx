export type CompactHeaderProps = {
	title: JSX.Element | string;
	subtitle?: JSX.Element | string | null;
	actions?: JSX.Element;
	details?: JSX.Element;
	coverUrl?: string | null;
	showCover?: boolean;
	disableTopPadding?: boolean;
	className?: string | null;
	children?: JSX.Element;
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
}: CompactHeaderProps) {
	const displayCover = showCover && coverUrl;

	return (
		<header
			className={`${className} flex w-full flex-col gap-5 ${
				disableTopPadding ? 'md:pt-6' : 'pt-4 lg:pt-20'
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
					<div className="absolute top-0 left-0 right-0 h-72 bg-gray-100 opacity-40 dark:bg-gray-900"></div>

					<div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
				</div>
			)}
			<div className="z-10 flex w-full items-end justify-between gap-5 text-gray-900 dark:text-gray-100">
				{displayCover && (
					<figure className="flex h-full w-12 flex-shrink-0 items-center overflow-hidden overflow-visible md:w-16 lg:w-20 xl:w-32 xl:flex-shrink">
						<img src={coverUrl} alt="" className="rounded shadow-lg " />
					</figure>
				)}

				<section className="flex flex-1 flex-col gap-1 font-medium">
					<h1 className="inline-flex flex-col items-start justify-start xl:flex-row  xl:items-center xl:items-baseline xl:gap-3">
						<div className="clamp-2 flex flex-col text-lg md:flex-row md:text-xl lg:text-2xl">
							{title}
						</div>
						{/* <div className="opacity-30">~</div> */}
						{subtitle && (
							<div className="hidden truncate text-xs text-gray-500 opacity-90 dark:text-gray-500 sm:text-sm md:block md:text-base lg:text-lg">
								{subtitle}
							</div>
						)}
					</h1>

					<section className="flex gap-4">{children}</section>
				</section>
				<nav className="z-10 flex items-center justify-end gap-4 text-gray-700 dark:text-gray-400">
					{actions}
				</nav>
			</div>
			<hr className="z-10 border-gray-700 border-opacity-20 dark:border-gray-600" />
		</header>
	);
}
