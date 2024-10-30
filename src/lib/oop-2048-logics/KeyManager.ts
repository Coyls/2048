import type { Game } from './Game.svelte';
import { Movement } from './Movement';

export class KeyManager {
	constructor(private game: Game) {}

	handleKeyUp(event: KeyboardEvent) {
		const key = event.key;

		switch (key) {
			case 'ArrowUp': {
				const movement = new Movement(this.game, 'top');
				const { grid, score } = movement.move();
				this.game.grid = grid;
				this.game.score = score;
				return { grid, score };
			}
			case 'ArrowDown': {
				const movement = new Movement(this.game, 'bottom');
				const { grid, score } = movement.move();
				this.game.grid = grid;
				this.game.score = score;
				return { grid, score };
			}
			case 'ArrowLeft': {
				const movement = new Movement(this.game, 'left');
				const { grid, score } = movement.move();
				this.game.grid = grid;
				this.game.score = score;
				return { grid, score };
			}
			case 'ArrowRight': {
				const movement = new Movement(this.game, 'right');
				const { grid, score } = movement.move();
				this.game.grid = grid;
				this.game.score = score;
				return { grid, score };
			}
			default:
				return { grid: this.game.grid, score: this.game.score };
		}
	}
}
