import type { Resource, ValueRef } from '~/models/resource/types';
import capitalize from '~/utilities/capitalize';
import ResourceValueLabel from '~/components/common/resource-value-label';
import BaseValue from './values/base-value';
import { PencilFill } from 'react-bootstrap-icons';
import { Form, Link, useLocation } from 'remix';
import { object, string, ZodSchema } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	composeResourceUrl,
	composeShortResourceUrl,
} from '~/utilities/resource-url';

type ValueFormProps = {
	value: ValueRef;
	schema: ZodSchema;
};

function ValueForm({ value, schema }: ValueFormProps) {
	return <></>;
}

type ValueBlockProps = {
	valueKey: string;
	resource: Resource;
	value: ValueRef | null;
	className?: string;
};

function Key() {}

function ValueBlock({ valueKey, value, resource, className }: ValueBlockProps) {
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

	const editUrl = `?${search.toString()}`;
	const initialValue = value ? (value.value as string) : '';
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
			<input
				type="hidden"
				name="redirectUrl"
				value={`${location.pathname}?${search.toString()}`}
			/>
			<input type="submit" className="hidden" />

			<input type="hidden" name="key" value={valueKey} />
			{/* <input type="hidden" name="ref" value={null} /> */}

			<dt className="flex items-center gap-2 text-sm font-medium text-theme-400">
				{capitalize(valueKey)}
				<Link
					className="opacity-40 hover:opacity-100"
					to={editUrl}
					onClick={(e) => setEditing((editing) => !editing)}
				>
					<PencilFill />
				</Link>
			</dt>
			<dd className="mt-1 text-lg font-medium sm:col-span-2 sm:mt-0">
				{value ? (
					editing ? (
						<input
							defaultValue={initialValue}
							{...register('value')}
							className="w-full rounded bg-theme-800 px-1"
						/>
					) : (
						<span className="block truncate">
							<BaseValue valueRef={value} />
						</span>
					)
				) : (
					'-'
				)}
			</dd>
		</Form>
	);
}

export default function ValueGrid({ resource }: { resource: Resource }) {
	const valueList = Object.entries(resource.values) as [
		[string, ValueRef | null]
	];
	return (
		<dl className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
			{valueList.map(([key, value]: [string, ValueRef | null]) => (
				<ValueBlock
					key={key}
					valueKey={key}
					value={value}
					resource={resource}
					className="col-span-2"
				/>
			))}
		</dl>
	);
}
