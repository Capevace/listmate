import { Link } from 'remix';

type ErrorViewProps = {
	message?: string;
	status?: number;
	className?: string;
};

function getBaseMessage(status?: number) {
	switch (status) {
		case 404:
			return 'Not Found';
		case 500:
			return 'Internal Server Error';
		default:
			return 'An unexpected error occurred';
	}
}

export default function ErrorView({
	message,
	status,
	className,
}: ErrorViewProps) {
	return (
		<div
			className={`mx-auto block flex max-w-xl flex-col items-center justify-center gap-8 ${className}`}
		>
			<h1 className="text-center text-3xl font-bold">
				{getBaseMessage(status)}
			</h1>
			{message && <h2 className="text-left text-xl font-medium">{message}</h2>}

			<a
				href="/"
				className="rounded-md bg-red-300 px-3 py-1 text-red-900 outline outline-transparent hover:bg-red-200 focus:outline-red-800"
			>
				Back to Home
			</a>
		</div>
	);
}
