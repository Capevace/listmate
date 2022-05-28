export type InlineButtonProps = React.HTMLProps<HTMLButtonElement> & {};

export function InlineButton(props: InlineButtonProps) {
	let buttonProps = { ...props } as any;

	if (buttonProps.sourceType)
		delete buttonProps.sourceType;

	return (
		<button
			{...buttonProps}
			type={props.type as 'button' | 'submit' | 'reset'}
			className={`${props.className}  flex items-center justify-center transition-opacity duration-75 hover:opacity-90`}
		>
			{props.children}
		</button>
	);
}
