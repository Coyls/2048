import type { Game } from './Game.svelte';

export class KeyManager {
	constructor(private game: Game) {}

	handleKeyUp(event: KeyboardEvent) {
		const key = event.key;
		console.log('key:', key);

		/* switch (key) {
			case 'ArrowUp':
				return moveToTop(this.game.grid, this.game.score);
			case 'ArrowDown':
				return moveToBottom(this.game.grid, this.game.score);
			case 'ArrowLeft':
				return moveToLeft(this.game.grid, this.game.score);
			case 'ArrowRight':
				return moveToRight(this.game.grid, this.game.score);
			default:
				return { grid: this.game.grid, score: this.game.score };
		} */
	}
}
