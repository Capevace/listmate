import debounce from '~/utilities/debounce';
import { useRef, useEffect, useCallback } from 'react';

/**
 * Debounce hook
 * Debounces a function
 *
 * @param callback The callback to debounce
 * @param wait The duration to debounce
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns the new debounced function.
 */
function useDebounce<T extends (...args: any[]) => unknown>(
	callback: T,
	wait: number
) {
	const createDebouncedCallback = useCallback(
		(function_: Function): Function => {
			return debounce(function_, wait);
		},
		[wait]
	);

	const debouncedCallbackRef = useRef<Function>(
		createDebouncedCallback(callback)
	);

	useEffect(() => {
		debouncedCallbackRef.current = createDebouncedCallback(callback);
	}, [callback, createDebouncedCallback]);

	return debouncedCallbackRef.current;
}

export { useDebounce };
