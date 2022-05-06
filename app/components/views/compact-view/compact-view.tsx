import CompactHeader, { CompactHeaderProps } from './compact-header';

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
			<CompactHeader
				className="mx-auto w-full max-w-7xl"
				{...props}
				disableTopPadding={props.disableTopPadding ?? !!props.top}
				children={props.headerDetails}
			></CompactHeader>
			<main className="z-10 mx-auto w-full max-w-7xl ">{props.children}</main>
		</article>
	);
}
