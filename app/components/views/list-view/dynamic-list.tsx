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
};

// TODO: Bundle optimization – Here we could bundle split the different type of lists

export default function DynamicList({
	items,
	header,
	headerHeight = 300,
	footer,
	footerHeight = 100,
}: DynamicListProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	const headerModifier = header ? 1 : 0;
	const footerModifier = footer ? 1 : 0;
	const total = items.length + headerModifier + footerModifier;

	const rowVirtualizer = useVirtual({
		size: total,
		parentRef,
		estimateSize: useCallback(
			(index) => {
				if (index === 0 && header) {
					return headerHeight;
				} else if (index === total - 1 && footer) {
					return footerHeight;
				}

				return 35;
			},
			[headerHeight, footerHeight, total, header, footer]
		),
		overscan: 5,
		initialRect: { width: 1920, height: 1080 },
		paddingStart: 0,
		paddingEnd: 40,
	});

	return (
		<div
			ref={parentRef}
			className="h-full max-h-screen w-full px-5"
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
				{rowVirtualizer.virtualItems.map((virtualRow) => {
					if (virtualRow.index === 0) {
						return (
							<section
								key="header"
								ref={virtualRow.measureRef}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								{header}
							</section>
						);
					} else if (virtualRow.index === total - 1 && footer) {
						return (
							<section
								key="footer"
								ref={virtualRow.measureRef}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								{footer}
							</section>
						);
					} else {
						const index = virtualRow.index - headerModifier;
						const item = items[index];

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
					}
				})}
			</div>
		</div>
	);
}
