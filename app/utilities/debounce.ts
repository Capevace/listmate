export default function debounce(func: Function, wait: number) {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: any[]) => {
		let later = () => {
			func(...args);
		};

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
