import { Except } from 'type-fest';
import { Resource } from '~/models/resource/types';

export default function filterValues<
	KeysType extends keyof TResource['values'],
	TResource extends Resource
>(values: TResource['values'], filters: string[]) {
	let filteredValues: Except<TResource['values'], KeysType> = { ...values };

	for (const filter of filters) {
		delete filteredValues[filter as keyof TResource['values']];
	}

	return filteredValues;
}
