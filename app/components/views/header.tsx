type HeaderContentProps = {
	title: string;
	subtitle?: string | null;
	coverUrl?: string | null;
	actions?: React.ReactNode;
};
export function HeaderContent(props: HeaderContentProps) {
	return (
		<div className="mb-5 flex items-start">
			<div className="flex-1 items-stretch">
				<div className="relative mb-5 flex flex-col">
					<h1 className="mb-2 text-4xl font-bold text-gray-100">
						{props.title}
					</h1>
					<p className="text-xl text-gray-300">{props.subtitle}</p>
				</div>
				<nav className="flex items-center gap-3">{props.actions}</nav>
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
			className={`relative my-5 border border-gray-700 bg-gray-800 px-10 py-8 shadow-xl sm:overflow-hidden sm:rounded-2xl ${props.className}`}
		>
			{props.children}
		</header>
	);
}

type HeaderProps = HeaderContentProps & {
	className?: string;
	children: React.ReactNode;
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
