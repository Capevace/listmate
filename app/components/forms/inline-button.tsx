export type InlineButtonProps = React.HTMLProps<HTMLButtonElement> & {};

export function InlineButton(props: InlineButtonProps) {
	return (
		<button
			{...{ ...props, sourceType: undefined }}
			type={props.type as 'button' | 'submit' | 'reset'}
			className={`${props.className}  flex items-center justify-center transition-opacity duration-75 hover:opacity-90`}
		>
			{props.children}
		</button>
	);
}
