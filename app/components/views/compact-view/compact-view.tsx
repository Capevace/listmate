import CompactHeader, { CompactHeaderProps } from './compact-header';

export type CompactViewProps = CompactHeaderProps & {
	parentRef?: React.RefObject<HTMLElement>;
	children?: JSX.Element;
};

export default function CompactView(props: CompactViewProps) {
	return (
		<article className="mx-auto flex w-full max-w-7xl flex-col gap-5">
			<CompactHeader {...props} children={undefined} />
			<main className="z-10" ref={props.parentRef}>
				{props.children}
			</main>
		</article>
	);
}
