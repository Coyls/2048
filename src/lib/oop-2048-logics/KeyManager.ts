import type { Game } from './Game.svelte';
import { Movement, type DirectionType } from './Movement';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export class KeyManager {
	constructor(private game: Game) {}

	async handleSwipe(direction: SwipeDirection) {
		switch (direction) {
			case 'up': {
				await this.onKeyUp('top');
				break;
			}
			case 'down': {
				await this.onKeyUp('bottom');
				break;
			}
			case 'left': {
				await this.onKeyUp('left');
				break;
			}
			case 'right': {
				await this.onKeyUp('right');
				break;
			}
			default:
				break;
		}

		this.game.checkIfGameIsWon();
		this.game.checkIfGameIsOver();
	}

	async handleKeyUp(event: KeyboardEvent) {
		const key = event.key;

		switch (key) {
			case 'ArrowUp': {
				await this.onKeyUp('top');
				break;
			}
			case 'ArrowDown': {
				await this.onKeyUp('bottom');
				break;
			}
			case 'ArrowLeft': {
				await this.onKeyUp('left');
				break;
			}
			case 'ArrowRight': {
				await this.onKeyUp('right');
				break;
			}
			default:
				break;
		}

		this.game.checkIfGameIsWon();
		this.game.checkIfGameIsOver();
	}

	private onKeyUp = async (direction: DirectionType) => {
		const movement = new Movement(this.game, direction);
		const { grid, score, animateAndUpdate } = movement.move();

		if (animateAndUpdate) {
			this.game.dataForAnimation.previousGrid = this.game.grid.clone();
			this.game.dataForAnimation.currentGridBeforeAddingNewTile = grid.clone();
			this.game.dataForAnimation.newTile = grid.addRandomTile();
			this.game.dataForAnimation.currentGrid = grid.clone();
		}

		this.game.score = score;
		this.game.grid = grid;

		await this.game.canvasManager.draw(animateAndUpdate, direction);
	};
}
