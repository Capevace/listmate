import CompactHeader, { CompactHeaderProps } from './compact-header';

export type CompactViewProps = CompactHeaderProps & {
	parentRef?: React.RefObject<HTMLElement>;
	headerDetails?: JSX.Element;
	children?: JSX.Element;
};

export default function CompactView(props: CompactViewProps) {
	return (
		<article
			className="flex max-h-screen w-full flex-col gap-5 overflow-x-hidden overflow-y-scroll px-4"
			ref={props.parentRef}
		>
			<CompactHeader
				className="mx-auto w-full max-w-7xl"
				{...props}
				children={props.headerDetails}
			></CompactHeader>
			<main className="z-10 mx-auto w-full max-w-7xl ">{props.children}</main>
		</article>
	);
}
