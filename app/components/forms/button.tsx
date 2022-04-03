export default function Button(props: { [key: string]: any }) {
	const className = `w-full rounded-lg bg-indigo-600 py-2 px-4 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 ${
		props.className ?? ''
	}`;
	return (
		<button type="button" {...props} className={className}>
			{props.children}
		</button>
	);
}
