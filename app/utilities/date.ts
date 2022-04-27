/**
 * Function to add seconds to date
 */
export function addSeconds(date: Date, seconds: number) {
	return new Date(date.getTime() + seconds * 1000);
}
