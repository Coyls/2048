import { CanvasManager } from './CanvasManager.svelte';
import type { Cell } from './Cell';
import type { CollisionType } from './Collision';
import { Collision } from './Collision';
import { Grid } from './Grid';
import { KeyManager } from './KeyManager';

// todo: move to config file
export const WIN_CONDITION = 2048;

interface DataForAnimation {
	newTile: Cell | null;
	previousGrid: Grid | null;
	currentGridBeforeAddingNewTile: Grid | null;
	currentGrid: Grid | null;
}

export class Game {
	// todo: move to config file (4, 4)
	grid = $state(new Grid(4, 4));
	score = $state(0);
	isGameOver = $state(false);
	isGameWon = $state(false);
	isGameContinue = $state(false);

	keyManager: KeyManager;
	canvasManager: CanvasManager;

	gridRowsLength: number;
	gridColsLength: number;

	dataForAnimation: DataForAnimation = {
		newTile: null,
		previousGrid: null,
		currentGridBeforeAddingNewTile: null,
		currentGrid: null
	};

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

		this.resetGrid();

		this.keyManager = new KeyManager(this);
		this.canvasManager = new CanvasManager(this, canvasSize);
	}

	private resetGrid() {
		const newGrid = new Grid(this.gridRowsLength, this.gridColsLength);
		this.dataForAnimation.previousGrid = newGrid.clone();
		this.grid = newGrid;
		this.dataForAnimation.currentGridBeforeAddingNewTile = this.grid.clone();
		this.dataForAnimation.newTile = this.grid.addRandomTile();
		this.dataForAnimation.currentGrid = this.grid.clone();
	}

	reset() {
		this.resetGrid();
		this.score = 0;
		this.isGameOver = false;
		this.isGameWon = false;
	}

	continueGame() {
		this.isGameContinue = true;
	}

	checkIfGameIsWon() {
		if (this.isGameContinue) return;

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
