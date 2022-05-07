import SpinnerIcon from '~/components/icons/spinner-icon';

export type CompactButtonProps = React.HTMLProps<HTMLButtonElement> & {
	loading?: boolean;
}

export default function CompactButton(props: CompactButtonProps) {
	return (
		<button 
			{...{...props, loading: undefined }} 
			type={props.type as 'button' | 'submit' | 'reset' | undefined} 
			className={`${props.className} relative px-1 ${props.loading ? 'pr-5' : ''} rounded bg-gray-400 py-1 text-center text-xs font-medium text-gray-900 dark:bg-gray-600 dark:text-gray-900`}
		>
			{props.children}
			{props.loading && <div className="absolute flex top-0 right-0 pr-1 w-3 h-full"><SpinnerIcon /></div>}
		</button>
	);
}