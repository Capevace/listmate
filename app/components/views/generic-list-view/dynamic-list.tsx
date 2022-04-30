import { useRef } from 'react';
import { useVirtual, VirtualItem } from 'react-virtual';

export type GenericDynamicListProps = {
	size: number;
	estimateHeight: (index: number) => number;
	page?: number;
	render: (index: number, item?: VirtualItem) => JSX.Element;
};

// TODO: Bundle optimization – Here we could bundle split the different type of lists

export default function GenericDynamicList({
	size,
	estimateHeight,
	page,
	render,
}: GenericDynamicListProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtual({
		size,
		parentRef,
		estimateSize: estimateHeight,
		overscan: 5,
		initialRect: { width: 1920, height: 1080 },
		paddingStart: 0,
		paddingEnd: 40,
	});

	return (
		<div
			ref={parentRef}
			className="require-js h-full max-h-screen w-full px-5"
			style={{ overflow: 'auto' }}
		>
			<div
				className="mx-auto block max-w-7xl"
				style={{
					height: `${rowVirtualizer.totalSize}px`,
					width: '100%',
					position: 'relative',
				}}
			>
				{rowVirtualizer.virtualItems.map((virtualRow) =>
					render(virtualRow.index, virtualRow)
				)}
			</div>
		</div>
	);
}
