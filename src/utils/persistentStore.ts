import { writable } from 'svelte/store';

function isBrowser() {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function persist<T>(key: string, initialValue: T) {
	let data = initialValue;

	if (isBrowser()) {
		const storedValue = localStorage.getItem(key);
		data = storedValue ? JSON.parse(storedValue) : initialValue;
	}

	const store = writable(data);

	if (isBrowser()) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const skfList = persist<string[]>('skfList', []);
export const websiteState = persist<number>('websiteState', 0);
