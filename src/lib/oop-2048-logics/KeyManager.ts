import type { Game } from './Game.svelte';
import { Movement } from './Movement';

export class KeyManager {
	constructor(private game: Game) {}

	handleKeyUp(event: KeyboardEvent) {
		const key = event.key;

		switch (key) {
			case 'ArrowUp':
				return Movement.move(this.game.grid, this.game.score, 'top');
			case 'ArrowDown':
				return Movement.move(this.game.grid, this.game.score, 'bottom');
			case 'ArrowLeft':
				return Movement.move(this.game.grid, this.game.score, 'left');
			case 'ArrowRight':
				return Movement.move(this.game.grid, this.game.score, 'right');
			default:
				return { grid: this.game.grid, score: this.game.score };
		}
	}
}
