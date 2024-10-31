import { getCellColorViolet, TEXT_COLOR_VIOLET } from '$lib/2048-logics/cell-color';
import { getCharacterSize } from '$lib/2048-logics/utils';
import { type AnimationState, PaintingState } from './AnimationState';
import type { Cell } from './Cell';
import type { Game } from './Game.svelte';
import type { Grid } from './Grid';

// todo: move to constants file
const FONT_SIZE = 32;
const ANIMATION_FRAME_COUNT = 30;

export class CanvasManager {
	canvas: HTMLCanvasElement | null = null;
	canvasSize: number;
	context: CanvasRenderingContext2D | null = null;
	cellSize: number;
	gapSize: number;
	game: Game;
	animationState: AnimationState;

	constructor(game: Game, canvasSize: number) {
		this.canvasSize = canvasSize;
		const { cellSize, gapSize } = this.getCellAndGapSize(canvasSize);
		this.cellSize = cellSize;
		this.gapSize = gapSize;
		this.game = game;
		this.animationState = new PaintingState(this);
	}

	// ! /////////////////////////////////////////////////

	async draw() {
		const context = this.context;
		if (!context) return;

		this.clearCanvas(context);

		context.font = `bold ${FONT_SIZE}px arial`;
		this.paintEmptyCells(context);

		// todo: pense a mettre en param la grid precedente
		this.paintTiles(context);
	}

	private paintEmptyCells(context: CanvasRenderingContext2D) {
		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = this.game.grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintEmptyCell({ context, cell });
			}
		}
	}

	private paintTiles(context: CanvasRenderingContext2D) {
		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = this.game.grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintTile({ context, cell });
			}
		}
	}

	private clearCanvas(context: CanvasRenderingContext2D) {
		context.clearRect(0, 0, this.canvasSize, this.canvasSize);
	}

	// ! /////////////////////////////////////////////////

	async paintCanvas() {
		await this.animationState.paintCanvas();
	}

	async setState(state: AnimationState) {
		this.animationState = state;
		await this.paintCanvas();
	}

	async startCycle() {
		await this.animationState.startCycle();
	}

	paint(grid: Grid = this.game.grid) {
		const context = this.context;
		if (!context) return;

		context.save();
		this.cleanCanvas();

		context.font = `bold ${FONT_SIZE}px arial`;

		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintEmptyCell({ context, cell });
				this.paintTile({ context, cell });
			}
		}

		context.restore();
	}

	async animationNewTile({ cell }: { cell: Cell }) {
		const context = this.context;
		if (!context) return;

		context.save();

		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		const frame = 0;

		const animateFrame = async (frame: number) => {
			if (frame >= ANIMATION_FRAME_COUNT) return;

			const size = (this.cellSize * frame) / ANIMATION_FRAME_COUNT;
			const offset = (this.cellSize - size) / 2;

			context.save();

			this.paintSquareBase({
				context,
				x: x + offset,
				y: y + offset,
				value: cell.content!.value,
				cellSize: size
			});
			this.paintText({ context, x, y, value: cell.content!.value });

			await new Promise((resolve) => setTimeout(resolve, 10));

			context.restore();

			await animateFrame(frame + 1);
			console.log('animateFrame', frame);
		};

		await animateFrame(frame);

		context.restore();
	}

	private cleanCanvas() {
		const context = this.context;
		if (!context) return;
		context.clearRect(0, 0, this.canvasSize, this.canvasSize);
	}

	private paintEmptyCell({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) {
		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		this.paintSquareBase({ context, x, y, value: 0, cellSize: this.cellSize });
	}

	private paintTile({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) {
		if (cell.content === null) return;

		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		this.paintSquareBase({ context, x, y, value: cell.content.value, cellSize: this.cellSize });
		this.paintText({ context, x, y, value: cell.content.value });
	}

	private paintText({
		context,
		x,
		y,
		value
	}: {
		context: CanvasRenderingContext2D;
		x: number;
		y: number;
		value: number;
	}) {
		context.fillStyle = TEXT_COLOR_VIOLET;
		context.fillText(
			value.toString(),
			x + this.cellSize / 2 - (getCharacterSize(value) * FONT_SIZE) / 4,
			y + this.cellSize / 2 + FONT_SIZE / 4
		);
	}

	private paintSquareBase({
		context,
		x,
		y,
		cellSize,
		value
	}: {
		context: CanvasRenderingContext2D;
		x: number;
		y: number;
		cellSize: number;
		value: number;
	}) {
		const cellColor = getCellColorViolet(value);
		context.fillStyle = cellColor;
		context.beginPath();
		context.roundRect(x, y, cellSize, cellSize, 10);
		context.fill();
	}

	private getCellAndGapSize(canvasSize: number): { cellSize: number; gapSize: number } {
		const cellSize = (5 * canvasSize) / 23; // Simplification de l'équation
		const gapSize = cellSize / 5;

		return { cellSize, gapSize };
	}
}
