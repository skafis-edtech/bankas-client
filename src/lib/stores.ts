import { writable, type Writable } from 'svelte/store';

export const loadingStore: Writable<boolean> = writable(false);
export const errorStore: Writable<string | null> = writable(null);
export const successStore: Writable<string | null> = writable(null);
