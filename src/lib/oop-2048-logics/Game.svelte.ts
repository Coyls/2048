import { CanvasManager } from './CanvasManager';
import { Grid } from './Grid';
import { KeyManager } from './KeyManager';

export class Game {
	grid: Grid;
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
}
