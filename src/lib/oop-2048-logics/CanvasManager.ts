import { getCellColorViolet, TEXT_COLOR_VIOLET } from '$lib/2048-logics/cell-color';
import { getCharacterSize } from '$lib/2048-logics/utils';
import type { Cell } from './Cell';
import type { Game } from './Game.svelte';

// todo: move to constants file
const FONT_SIZE = 32;

export class CanvasManager {
	canvas: HTMLCanvasElement | null = null;
	canvasSize: number;
	cellSize: number;
	gapSize: number;
	game: Game;

	constructor(game: Game, canvasSize: number) {
		this.canvasSize = canvasSize;
		const { cellSize, gapSize } = this.getCellAndGapSize(canvasSize);
		this.cellSize = cellSize;
		this.gapSize = gapSize;
		this.game = game;
	}

	private getCellAndGapSize = (canvasSize: number): { cellSize: number; gapSize: number } => {
		const cellSize = (5 * canvasSize) / 23; // Simplification de l'équation
		const gapSize = cellSize / 5;

		return { cellSize, gapSize };
	};

	paint = () => {
		const context = this.canvas?.getContext('2d');
		if (!context) return;

		context.font = `bold ${FONT_SIZE}px arial`;

		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = this.game.grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintCell({ context, cell });
			}
		}
	};

	private paintCell = ({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) => {
		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		const cellColor = getCellColorViolet(cell.content?.value ?? 0);
		context.fillStyle = cellColor;
		context.beginPath();
		context.roundRect(x, y, this.cellSize, this.cellSize, 10);
		context.fill();

		context.fillStyle = TEXT_COLOR_VIOLET;
		context.fillText(
			cell.content === null ? '' : cell.content.value.toString(),
			x + this.cellSize / 2 - (getCharacterSize(cell.content?.value ?? 0) * FONT_SIZE) / 4,
			y + this.cellSize / 2 + FONT_SIZE / 4
		);
	};
}
