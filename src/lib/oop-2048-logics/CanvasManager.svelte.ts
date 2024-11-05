import { getCellColorBougie, getTextColorBougie } from '$lib/oop-2048-logics/cell-color';
import type { Cell } from './Cell';
import type { Game } from './Game.svelte';
import type { Grid } from './Grid';
import type { DirectionType } from './Movement';

// todo: move to config file
export const MAX_CANVAS_SIZE = 500;
const ANIMATION_FRAME_COUNT = 30;
const STARTING_FRAME = 0;
const FRAME_STEP = 1;
const FONT_SIZE_PX = 32;
const FONT_FAMILY = 'poppins';
const FONT_WEIGHT = 'bold';
const FRAME_DELAY_MOVEMENT_MS = 1;
const FRAME_DELAY_APPARITION_MS = 7;
const EMPTY_CELL_VALUE = 0;

type TilePositions = {
	id: string;
	value: number;
	prev: Position;
	current: Position;
};

type TilePositionsWithId = { id: string; value: number } & Position;

type Position = { x: number; y: number };

export class CanvasManager {
	canvas: HTMLCanvasElement | null = null;
	canvasSize = $state(0);
	context: CanvasRenderingContext2D | null = null;
	cellSize: number;
	gapSize: number;
	fontSizePx: number;
	game: Game;

	constructor(game: Game, canvasSize: number) {
		const { cellSize, gapSize } = this.getCellAndGapSize(canvasSize);
		this.canvasSize = canvasSize;
		this.cellSize = cellSize;
		this.gapSize = gapSize;
		this.game = game;
		this.fontSizePx = (FONT_SIZE_PX * canvasSize) / MAX_CANVAS_SIZE;
	}

	onResize(canvasSize: number) {
		const { cellSize, gapSize } = this.getCellAndGapSize(canvasSize);
		this.canvasSize = canvasSize;
		this.cellSize = cellSize;
		this.gapSize = gapSize;
		this.fontSizePx = (FONT_SIZE_PX * this.canvasSize) / MAX_CANVAS_SIZE;
	}

	async draw(animate: boolean = true, direction: DirectionType | null = null) {
		const context = this.context;
		if (!context) return;
		context.font = this.getCanvasFont();

		this.clearCanvas(context);
		this.paintEmptyCells(context);
		if (this.game.dataForAnimation.previousGrid) {
			this.paintTiles(context, this.game.dataForAnimation.previousGrid.cells);
		}

		if (animate && direction) {
			await this.animationMovement(context);
		}

		this.clearCanvas(context);
		this.paintEmptyCells(context);
		if (this.game.dataForAnimation.currentGridBeforeAddingNewTile) {
			this.paintTiles(context, this.game.dataForAnimation.currentGridBeforeAddingNewTile.cells);
		}

		if (this.game.dataForAnimation.newTile && animate) {
			await this.animationNewTile({ context, cell: this.game.dataForAnimation.newTile });
		}

		this.clearCanvas(context);
		this.paintEmptyCells(context);
		this.paintTiles(context, this.game.grid.cells);
	}

	private paintEmptyCells(context: CanvasRenderingContext2D) {
		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = this.game.grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintEmptyCell({ context, cell });
			}
		}
	}

	private paintTiles(context: CanvasRenderingContext2D, cells: Cell[]) {
		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintTile({ context, cell });
			}
		}
	}

	private clearCanvas(context: CanvasRenderingContext2D) {
		context.clearRect(0, 0, this.canvasSize, this.canvasSize);
	}

	private async animationNewTile({
		context,
		cell
	}: {
		context: CanvasRenderingContext2D;
		cell: Cell;
	}) {
		const x = cell.col * (this.cellSize + this.gapSize);
		const y = cell.row * (this.cellSize + this.gapSize);

		const frame = STARTING_FRAME;

		const animateFrame = async (frame: number) => {
			if (frame >= ANIMATION_FRAME_COUNT) return;

			const size = (this.cellSize * frame) / ANIMATION_FRAME_COUNT;
			const offset = (this.cellSize - size) / 2;

			this.paintSquareBase({
				context,
				x: x + offset,
				y: y + offset,
				value: cell.content!.value,
				cellSize: size
			});
			this.paintText({ context, x, y, value: cell.content!.value });

			await new Promise((resolve) => setTimeout(resolve, FRAME_DELAY_APPARITION_MS));

			await animateFrame(frame + FRAME_STEP);
		};

		await animateFrame(frame);
	}

	private async animationMovement(context: CanvasRenderingContext2D) {
		const tilePositions = this.getTilePositionsForAnimation();

		if (!tilePositions || tilePositions.length === 0) return;

		const startingFrame = STARTING_FRAME;

		const animateFrame = async (frame: number) => {
			if (frame >= ANIMATION_FRAME_COUNT) return;

			const positions = tilePositions.map((tilePosition) => {
				const id = tilePosition.id;
				const value = tilePosition.value;
				const currX = this.interpolatePosition(frame, tilePosition.prev.x, tilePosition.current.x);
				const currY = this.interpolatePosition(frame, tilePosition.prev.y, tilePosition.current.y);

				return {
					id,
					value,
					x: currX,
					y: currY
				};
			}) satisfies TilePositionsWithId[];

			this.paintGridFromPositions(context, positions);

			await new Promise((resolve) => setTimeout(resolve, FRAME_DELAY_MOVEMENT_MS));

			return animateFrame(frame + FRAME_STEP);
		};

		await animateFrame(startingFrame);
	}

	private interpolatePosition(frame: number, prevPosition: number, nextPosition: number): number {
		const ratio = frame / ANIMATION_FRAME_COUNT;
		return prevPosition + ratio * (nextPosition - prevPosition);
	}

	private getTilePositionsForAnimation() {
		return this.game.dataForAnimation.previousGrid?.cells.reduce((acc, prevCell) => {
			if (prevCell.content === null) return acc;

			const prevTileId = prevCell.content.id;

			const currentCellWithTile =
				this.game.dataForAnimation.currentGridBeforeAddingNewTile?.cells.find(
					(cell) =>
						cell.content?.id === prevTileId ||
						cell.content?.parents?.some((parent) => parent.id === prevTileId)
				);

			if (!currentCellWithTile) return acc;

			const tilePositions = {
				id: prevTileId,
				value: prevCell.content.value,
				prev: { x: this.whereToDraw(prevCell.col), y: this.whereToDraw(prevCell.row) },
				current: {
					x: this.whereToDraw(currentCellWithTile.col),
					y: this.whereToDraw(currentCellWithTile.row)
				}
			};

			return [...acc, tilePositions];
		}, [] as TilePositions[]);
	}

	/**
	 * ! A utiliser pour debug uniquement
	 * @deprecated
	 */
	paint(grid: Grid = this.game.grid) {
		const context = this.context;
		if (!context) return;

		this.cleanCanvas();

		context.font = this.getCanvasFont();

		for (let i = 0; i < this.game.gridRowsLength; i++) {
			for (let j = 0; j < this.game.gridColsLength; j++) {
				const cell = grid.cells.find((cell) => cell.row === i && cell.col === j)!;

				this.paintEmptyCell({ context, cell });
				this.paintTile({ context, cell });
			}
		}
	}

	private cleanCanvas() {
		const context = this.context;
		if (!context) return;
		context.clearRect(0, 0, this.canvasSize, this.canvasSize);
	}

	private paintEmptyCell({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) {
		const x = this.whereToDraw(cell.col);
		const y = this.whereToDraw(cell.row);

		this.paintSquareBase({ context, x, y, value: EMPTY_CELL_VALUE, cellSize: this.cellSize });
	}

	private paintGridFromPositions(
		context: CanvasRenderingContext2D,
		positions: TilePositionsWithId[]
	) {
		this.clearCanvas(context);
		this.paintEmptyCells(context);
		this.paintFloatingTiles(context, positions);
	}

	private paintFloatingTiles(context: CanvasRenderingContext2D, positions: TilePositionsWithId[]) {
		for (const position of positions) {
			const { x, y, value } = position;

			this.paintSquareBase({
				context,
				x,
				y,
				value,
				cellSize: this.cellSize
			});
			this.paintText({ context, x, y, value });
		}
	}

	private whereToDraw(pos: number) {
		return pos * (this.cellSize + this.gapSize);
	}

	private paintTile({ context, cell }: { context: CanvasRenderingContext2D; cell: Cell }) {
		if (cell.content === null) return;

		const x = this.whereToDraw(cell.col);
		const y = this.whereToDraw(cell.row);

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
		context.fillStyle = getTextColorBougie(value);
		context.fillText(
			value.toString(),
			x + this.cellSize / 2 - (this.getCharacterSize(value) * this.fontSizePx) / 4,
			y + this.cellSize / 2 + this.fontSizePx / 4
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
		const cellColor = getCellColorBougie(value);
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

	private getCharacterSize(value: number) {
		return value.toString().split('').length;
	}

	private getCanvasFont() {
		return `${FONT_WEIGHT} ${this.fontSizePx}px ${FONT_FAMILY}`;
	}
}
