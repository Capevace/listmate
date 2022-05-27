import SpinnerIcon from '~/components/icons/spinner-icon';

export type CompactButtonProps = React.HTMLProps<HTMLButtonElement> & {
	loading?: boolean;
};

export default function CompactButton(props: CompactButtonProps) {
	return (
		<button
			{...{ ...props, loading: undefined }}
			type={props.type as 'button' | 'submit' | 'reset' | undefined}
			className={`${props.className} relative px-1 ${
				props.loading ? 'pr-5' : ''
			} rounded bg-theme-400 py-1 text-center text-xs font-medium text-theme-900 dark:bg-theme-600 dark:text-theme-900`}
		>
			{props.children}
			{props.loading && (
				<div className="absolute top-0 right-0 flex h-full w-3 pr-1">
					<SpinnerIcon />
				</div>
			)}
		</button>
	);
}
