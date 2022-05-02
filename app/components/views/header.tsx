type HeaderContentProps = {
	title: string | React.ReactNode;
	subtitle?: string | React.ReactNode | null;
	coverUrl?: string | null;
	actions?: React.ReactNode;
};
export function HeaderContent(props: HeaderContentProps) {
	return (
		<div className="flex items-start ">
			<div className="flex flex-1 flex-col items-stretch gap-5">
				<div className="relative">
					<h1 className="mb-2 text-4xl font-bold">{props.title}</h1>
					<p className="text-xl text-gray-500 dark:text-gray-300">
						{props.subtitle}
					</p>
				</div>
				{props.actions && (
					<nav className="flex items-center gap-3">{props.actions}</nav>
				)}
			</div>
			{props.coverUrl && (
				<aside
					className="relative aspect-square h-48 justify-end rounded-lg bg-cover bg-center shadow-lg"
					style={{
						backgroundImage: `url(${props.coverUrl})`,
					}}
				></aside>
			)}
		</div>
	);
}

type HeaderBackgroundProps = {
	className?: string;
	children: React.ReactNode;
};
export function HeaderBackground(props: HeaderBackgroundProps) {
	return (
		<header
			className={`00 relative my-5 border border-gray-100 bg-gray-200 px-10 py-8 text-gray-700 text-gray-700 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:overflow-hidden sm:rounded-2xl ${props.className}`}
		>
			{props.children}
		</header>
	);
}

type HeaderProps = HeaderContentProps & {
	className?: string;
	children?: React.ReactNode;
};

export default function Header(props: HeaderProps) {
	return (
		<HeaderBackground className={props.className}>
			<HeaderContent
				title={props.title}
				subtitle={props.subtitle}
				coverUrl={props.coverUrl}
				actions={props.actions}
			/>

			{props.children}
		</HeaderBackground>
	);
}
