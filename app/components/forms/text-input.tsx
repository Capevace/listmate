import SpinnerIcon from '../icons/spinner-icon';

export type EmbeddedSelectOptionProps = React.HTMLProps<HTMLOptionElement> & {
	label: JSX.Element | string;
};

export function EmbeddedSelectOption(props: EmbeddedSelectOptionProps) {
	return <option {...props}>{props.label}</option>;
}

export type EmbeddedSelectProps = {
	label: string;
	children?: JSX.Element;
};

export function EmbeddedSelect({ label, children }: EmbeddedSelectProps) {
	return (
		<>
			<label htmlFor="currency" className="sr-only">
				{label}
			</label>
			<select
				id="currency"
				name="currency"
				className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-theme-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			>
				{children}
			</select>
		</>
	);
}

export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
	label: string | JSX.Element;
	className?: string;
	inputClassName?: string;
	loading?: boolean;
	left?: JSX.Element;
	right?: JSX.Element;
};

export default function TextInput(props: TextInputProps) {
	let inputProps = {
		...props,
	};
	delete inputProps.inputClassName;
	delete inputProps.className;
	delete inputProps.loading;
	delete inputProps.left;
	delete inputProps.right;

	return (
		<div>
			<label
				htmlFor={props.name}
				className="block text-sm font-medium text-theme-700 dark:text-theme-300"
			>
				{props.label}
			</label>
			<div className="relative mt-1 rounded-md shadow-sm">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center pl-2">
					{props.loading ? (
						<figure className="w-5">
							<SpinnerIcon />
						</figure>
					) : (
						props.left
					)}
				</div>

				<input
					type="text"
					{...inputProps}
					className={`${
						props.loading || props.left ? 'pl-14' : 'pl-0'
					} block w-full rounded-md border-theme-300 pr-12 font-medium focus:border-indigo-500 focus:ring-indigo-500 dark:border-theme-600 dark:bg-theme-700 sm:text-sm`}
				/>
				<div className="absolute inset-y-0 right-0 flex items-center">
					{props.right}
				</div>
			</div>
		</div>
	);
}
