/**
 * Factory function to create a progress module.
 *
 * It supports creating sub-progresses that are able to span a pre-set total.
 * This is helpful if the fraction of steps is not known beforehand.
 *
 * Example:
 *
 * 	const progress = makeProgress((step, total) => console.log(`Total: ${total * 100}%`));
 *
 * 	progress(0.1); // "Total: 10%"
 * 	progress(0.4); // "Total: 40%"
 *
 * 	const subProgress = progress.sub(0.5);
 * 	subProgress(0.1); // "Total: 45%"
 * 	subProgress(0.2); // "Total: 50%"
 * 	subProgress(0.8); // "Total: 80%"
 * 	subProgress(1.0); // "Total: 90%"
 *
 * 	progress(1.0); // "Total: 100%"
 */
export default function makeProgress(
	onProgress: (total: number) => void = () => {}
) {
	let total = 0;

	const minMax = (fraction: number) => Math.max(0.0, Math.min(1.0, fraction));

	const progress: ProgressFunction = (newTotal: number) => {
		total = minMax(newTotal);

		onProgress(total);
	};

	progress.sub = (subRange: number) => {
		const totalWhenStarted = Number(total);

		return makeProgress((localTotal: number) => {
			const fraction = subRange * localTotal;
			total = minMax(totalWhenStarted + fraction);
			onProgress(total);
		});
	};

	return progress;
}

export type ProgressFunction = ((step: number) => void) & {
	sub: (subRange: number) => ProgressFunction;
};
