export type MainViewProps = {
	children: React.ReactNode;
	className?: string;
};

export default function MainView({ children, className }: MainViewProps) {
	return (
		<div
			className={`mx-auto w-full max-w-7xl flex-1 pb-10 sm:px-6 lg:px-8 ${
				className || ''
			}`}
		>
			{children}
		</div>
	);
}
