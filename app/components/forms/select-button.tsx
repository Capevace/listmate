import { Button, Select } from '@mantine/core';
import { useState } from 'react';
import { ALL_SOURCE_TYPES, SourceType } from '~/models/resource/types';

export type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type SelectButtonProps = {
	name?: string;
	data?: SelectOption[];
	children?: React.ReactNode;
};

export default function SelectButton({
	data = [],
	name,
	children,
}: SelectButtonProps) {
	const padding = `px-4 py-1`;

	return (
		<div
			className={`relative flex items-center overflow-hidden rounded-lg bg-blue-700`}
		>
			<select
				placeholder="Select source"
				name={name}
				className={`${padding} h-full border-4 border-transparent bg-blue-800 text-center text-blue-100`}
			>
				<option value="" disabled>
					Select
				</option>
				{data.map((option) => (
					<option
						key={option.value}
						value={option.value}
						disabled={option.disabled}
					>
						{option.label}
					</option>
				))}
			</select>
			<Button
				type="submit"
				color="blue"
				className={`${padding} border-l-2 border-blue-800`}
				style={{
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
				}}
			>
				{children}
			</Button>
		</div>
	);
}
