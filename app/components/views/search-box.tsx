import { Form, useSearchParams } from 'remix';
import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { Input } from '@mantine/core';

type SearchBoxProps = {
	className?: string;
};

export default function SearchBox({ className }: SearchBoxProps) {
	const [params] = useSearchParams();
	const searchStringParam = params.get('text') || '';

	const [searchString, setSearchString] = useState(searchStringParam);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchString(e.target.value);
	};

	return (
		<div className={`flex items-center ${className || ''}`}>
			<Form action="/library/search" className="w-full">
				<Input
					placeholder="Search..."
					icon={<SearchIcon className="w-4" />}
					className="w-full"
					name="text"
					variant="default"
					size="xs"
					value={searchString}
					onChange={handleChange}
				/>
			</Form>
		</div>
	);
}
