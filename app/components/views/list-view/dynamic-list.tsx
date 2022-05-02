import type { Resource } from '~/models/resource/types';

import { useCallback, useRef } from 'react';
import { useVirtual } from 'react-virtual';

import BaseRow from './rows/base-row';

export type DynamicListProps = {
	items: Resource[];
	header: React.ReactNode;
	headerHeight?: number;
	footer: React.ReactNode;
	footerHeight?: number;
	page?: number;
	render: (item: any, index: number) => JSX.Element;
};

// TODO: Bundle optimization – Here we could bundle split the different type of lists

export default function DynamicList({
	items,
	header,
	headerHeight = 300,
	footer,
	footerHeight = 100,
	render,
}: DynamicListProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtual({
		size: items.length,
		parentRef,
		estimateSize: useCallback((index) => {
			return 50;
		}, []),
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
			{header}
			<div
				className="mx-auto block max-w-7xl"
				style={{
					height: `${rowVirtualizer.totalSize}px`,
					width: '100%',
					position: 'relative',
				}}
			>
				{rowVirtualizer.virtualItems.map((virtualRow) => {
					const item = items[virtualRow.index];

					return (
						<BaseRow
							key={item.id}
							resource={item}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						/>
					);
				})}
			</div>
			{footer}
		</div>
	);
}
