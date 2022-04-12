export default function retry<T>(
	fn: () => Promise<T>,
	retries = 3
): Promise<T> {
	return fn().catch(async (e) => {
		if (retries > 0) {
			console.warn('Retrying', e);
			return retry(fn, retries - 1);
		}

		throw e;
	});
}
