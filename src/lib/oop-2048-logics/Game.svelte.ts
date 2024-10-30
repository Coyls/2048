import { CanvasManager } from './CanvasManager';
import type { CollisionType } from './Collision';
import { Collision } from './Collision';
import { Grid } from './Grid';
import { KeyManager } from './KeyManager';

export const WIN_CONDITION = 2048;

export class Game {
	grid = $state(new Grid(4, 4));
	score = $state(0);
	isGameOver = $state(false);
	isGameWon = $state(false);

	keyManager: KeyManager;
	canvasManager: CanvasManager;

	gridRowsLength: number;
	gridColsLength: number;

	constructor({
		gridRowsLength,
		gridColsLength,
		canvasSize
	}: {
		gridRowsLength: number;
		gridColsLength: number;
		canvasSize: number;
	}) {
		this.gridRowsLength = gridRowsLength;
		this.gridColsLength = gridColsLength;
		this.grid = new Grid(this.gridRowsLength, this.gridColsLength);
		this.keyManager = new KeyManager(this);
		this.canvasManager = new CanvasManager(this, canvasSize);
	}

	reset() {
		this.grid = new Grid(this.gridRowsLength, this.gridColsLength);
		this.score = 0;
		this.isGameOver = false;
		this.isGameWon = false;
	}

	checkIfGameIsWon() {
		const gameIsWon = this.grid.cells.some((cell) => cell.content?.value === WIN_CONDITION);

		this.isGameWon = gameIsWon;
	}

	checkIfGameIsOver() {
		const allColisionTypePossible: CollisionType[] = [];

		for (let i = 0; i < this.gridRowsLength; i++) {
			for (let j = 0; j < this.gridColsLength; j++) {
				const cell = this.grid.cells.find((cell) => cell.row === i && cell.col === j)!;
				const nextRowCell = this.grid.cells.find((cell) => cell.row === i + 1 && cell.col === j);
				const nextColCell = this.grid.cells.find((cell) => cell.row === i && cell.col === j + 1);

				if (nextRowCell) {
					const rowCollision = new Collision(cell, nextRowCell, 0);
					allColisionTypePossible.push(rowCollision.checkCollision());
				}

				if (nextColCell) {
					const colCollision = new Collision(cell, nextColCell, 0);
					allColisionTypePossible.push(colCollision.checkCollision());
				}
			}
		}

		const gameIsOver = allColisionTypePossible.every((type) => type === 'isDifferent');

		this.isGameOver = gameIsOver;
	}
}
