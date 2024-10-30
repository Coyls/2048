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

				this.paintEmptyCell({ context, cell });
				this.paintTile({ context, cell });
			}
		}
	};

	private paintEmptyCell = ({
		context,
		cell
	}: {
		context: CanvasRenderingContext2D;
		cell: Cell;
	}) => {
		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		this.paintSquareBase({ context, x, y, value: 0 });
	};

	private paintTile = ({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) => {
		if (cell.content === null) return;
		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		this.paintSquareBase({ context, x, y, value: cell.content.value });

		context.fillStyle = TEXT_COLOR_VIOLET;
		context.fillText(
			cell.content.value.toString(),
			x + this.cellSize / 2 - (getCharacterSize(cell.content.value) * FONT_SIZE) / 4,
			y + this.cellSize / 2 + FONT_SIZE / 4
		);
	};

	private paintSquareBase = ({
		context,
		x,
		y,
		value
	}: {
		context: CanvasRenderingContext2D;
		x: number;
		y: number;
		value: number;
	}) => {
		const cellColor = getCellColorViolet(value);
		context.fillStyle = cellColor;
		context.beginPath();
		context.roundRect(x, y, this.cellSize, this.cellSize, 10);
		context.fill();
	};
}
