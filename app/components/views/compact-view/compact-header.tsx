export type CompactHeaderProps = {
	title: JSX.Element | string;
	subtitle?: JSX.Element | string | null;
	actions?: JSX.Element;
	coverUrl?: string | null;
	showCover?: boolean;
	children?: JSX.Element;
};

export default function CompactHeader({
	title,
	subtitle,
	actions,
	coverUrl,
	showCover,
	children,
}: CompactHeaderProps) {
	const displayCover = showCover && coverUrl;

	return (
		<header
			className={`flex w-full flex-col gap-5 ${
				displayCover ? 'pt-20' : 'pt-48'
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
					<div className="absolute top-0 left-0 right-0 h-72 bg-gray-100 opacity-40"></div>

					<div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
				</div>
			)}
			<div className="z-10 flex w-full items-end justify-between gap-5 text-gray-900 dark:text-gray-100">
				{displayCover && (
					<figure className="w-36 overflow-hidden rounded shadow-lg">
						<img src={coverUrl} alt="" />
					</figure>
				)}

				<section className="flex flex-1 flex-col gap-1 font-medium">
					<h1 className="text-2xl">{title}</h1>
					{subtitle && (
						<p className="text-sm text-gray-800 dark:text-gray-200">
							{subtitle}
						</p>
					)}

					{children}
				</section>
				<nav className="z-10 flex items-center justify-end gap-2 text-gray-700 dark:text-gray-400">
					{actions}
				</nav>
			</div>
			<hr className="z-10 border-gray-700 border-opacity-20 dark:border-gray-600" />
		</header>
	);
}
