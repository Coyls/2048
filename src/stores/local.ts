import { writable } from 'svelte/store';

// Get the value out of storage on load.
const stored = parseInt(localStorage.getItem('highScore') ?? '0');

// Set the stored value or a sane default.
export const highScore = writable(stored || 0);

// Anytime the store changes, update the local storage value.
highScore.subscribe((value) => (localStorage.highScore = value));
