import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { Form, Link, useLocation } from 'remix';
import { object, string } from 'zod';
import type { StrictValueData } from '~/models/resource/refs';
import type { Resource } from '~/models/resource/types';
import { ValueType } from '~/models/resource/ValueType';
import capitalize from '~/utilities/capitalize';
import { composeShortResourceUrl } from '~/utilities/resource-url';
import DataField from './values/DataField';

type DetailTitleProps = {
	label: string;
	editUrl: string;
	onEdit: () => void;
};

function DetailTitle({ label, editUrl, onEdit }: DetailTitleProps) {
	return (
		<dt className="flex items-center gap-2 text-sm font-medium text-theme-400">
			{label}
			<Link
				className="opacity-40 hover:opacity-100"
				to={editUrl}
				onClick={onEdit}
			>
				<PencilFill />
			</Link>
		</dt>
	);
}

type ValueBlockProps = {
	resource: Resource;
	valueKey: string;
	data: StrictValueData;
	className?: string;
};

function StrictValueBlock({
	valueKey,
	data,
	resource,
	className,
}: ValueBlockProps) {
	const location = useLocation();
	let search = new URLSearchParams(location.search);
	const editKeys = search.getAll('edit');
	const isEditingQuery = editKeys.includes(valueKey);
	const [editing, setEditing] = useState(isEditingQuery);

	if (!editing) {
		search.append('edit', valueKey);
	} else {
		search.delete('edit');
		editKeys.forEach(
			(editKey) => editKey !== valueKey && search.append('edit', editKey)
		);
	}

	const initialValue = data ? String(data.value) : '';
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(object({ value: string() })),
		defaultValues: {
			value: initialValue,
		},
	});

	useEffect(() => {
		if (editing) setFocus('value', { shouldSelect: true });
	}, [editing, setFocus]);

	return (
		<Form
			className={`${className} w-full`}
			method="post"
			action={composeShortResourceUrl(resource.id, `update-value`)}
		>
			<input type="submit" className="hidden" />
			<input type="hidden" name="key" value={valueKey} />
			{/* <input type="hidden" name="ref" value={null} /> */}
			<input
				type="hidden"
				name="redirectUrl"
				value={`${location.pathname}?${search.toString()}`}
			/>

			<DetailTitle
				label={capitalize(valueKey)}
				editUrl={`?${search.toString()}`}
				onEdit={() => setEditing((editing) => !editing)}
			/>

			<dd className="mt-1 text-lg font-medium sm:col-span-2 sm:mt-0">
				{editing ? (
					<input
						defaultValue={initialValue}
						{...register('value')}
						className="w-full rounded bg-theme-800 px-1"
					/>
				) : (
					<span className="block truncate">
						<DataField data={data} />
					</span>
				)}
			</dd>
		</Form>
	);
}

export default function ValueGrid({ resource }: { resource: Resource }) {
	return (
		<dl className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
			{Object.entries(resource.values).map(([key, value]) =>
				value.type === ValueType.LIST ? (
					'list'
				) : (
					<StrictValueBlock
						key={key}
						valueKey={key}
						data={value}
						resource={resource}
						className="col-span-2"
					/>
				)
			)}
		</dl>
	);
}
