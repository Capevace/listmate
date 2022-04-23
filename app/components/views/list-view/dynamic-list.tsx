import { useCallback, useRef } from 'react';
import type { ListItemData } from '~/models/item.server';
import type { List } from '~/models/list.server';
import BaseRow from './rows/base-row';

import { useVirtual } from 'react-virtual';
import SongRow from './rows/song-row';
import { Song } from '~/models/resource/resource.types';

const getItemSize = (index: number) => {
	switch (index) {
		case 0:
			return 300;
		default:
			return 35;
	}
};

export type DynamicListProps = {
	list: List;
	items: ListItemData[];
	Header: React.ReactNode;
	page?: number;
};

// TODO: Bundle optimization – Here we could bundle split the different type of lists

export default function DynamicList({ list, items, Header }: DynamicListProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtual({
		size: items.length,
		parentRef,
		estimateSize: useCallback(() => 35, []),
		overscan: 5,
		initialRect: { width: 1920, height: 1080 },
		paddingStart: 300,
		paddingEnd: 40,
	});

	return (
		<div
			ref={parentRef}
			className="h-full max-h-screen w-full px-5"
			style={{
				// height: `200px`,
				// width: `400px`,
				overflow: 'auto',
			}}
		>
			<div
				className="mx-auto block max-w-7xl"
				style={{
					height: `${rowVirtualizer.totalSize}px`,
					width: '100%',
					position: 'relative',
				}}
			>
				{Header}
				{rowVirtualizer.virtualItems.map((virtualRow) => {
					const item = items[virtualRow.index];

					return (
						<BaseRow
							key={item.id}
							list={list}
							item={item}
							index={virtualRow.index}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${items[virtualRow.index]}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
}
