import {
	GRID_COLS_LENGTH,
	GRID_ROWS_LENGTH,
	MAX_COL_INDEX,
	MAX_ROW_INDEX
} from '../2048-logics/base';
import { Collision } from './Collision';

export const directionTypes = ['top', 'bottom', 'left', 'right'] as const;
export type DirectionType = (typeof directionTypes)[number];

import { Cell } from './Cell';
import type { Game } from './Game.svelte';
import { Grid } from './Grid';

export class Movement {
	direction: DirectionType;
	tmpCells: Cell[] = [];
	tmpScore: number = 0;
	startPosition: number = 0;
	tmpStartPosition: number = 0;

	constructor(
		private game: Game,
		direction: DirectionType
	) {
		this.direction = direction;
		this.tmpScore = game.score;
		this.startPosition = this.getStartPositionFromDirection();
		this.tmpStartPosition = this.getStartPositionFromDirection();
	}

	move() {
		this.createLoopLineFromDirection((index) => {
			const line = this.getLineFromDirection({ index, grid: this.game.grid });

			const updatedLine = this.recursiveMovementLine({
				line
			});

			this.tmpCells.push(...updatedLine.newLine);
			this.tmpScore = updatedLine.newScore;
			this.tmpStartPosition = this.getStartPositionFromDirection();
			this.startPosition = this.getStartPositionFromDirection();
		});

		const updatedGrid = new Grid(this.game.grid.gridRowsLength, this.game.grid.gridColsLength);

		updatedGrid.cells = this.tmpCells;

		updatedGrid.cleanCollidedCells();

		console.log('ARE SAME GRID', Grid.areSameGrids(updatedGrid, this.game.grid));

		if (Grid.areSameGrids(updatedGrid, this.game.grid)) {
			return { grid: updatedGrid, score: this.tmpScore };
		}

		updatedGrid.addRandomValue();

		return {
			grid: updatedGrid,
			score: this.tmpScore
		};
	}

	recursiveMovementLine({ line }: { line: Cell[] }): {
		newLine: Cell[];
		newScore: number;
	} {
		let updatedLine = line;

		while (this.whileCondition()) {
			const currentCell = this.getCurrentCell(updatedLine);
			if (!currentCell) return { newLine: updatedLine, newScore: this.tmpScore };
			const nextCell = this.getNextCell(updatedLine, currentCell);
			if (!nextCell) return { newLine: updatedLine, newScore: this.tmpScore };

			const collision = new Collision(currentCell, nextCell, this.tmpScore);

			const { newCurrentCell, newNextCell, newScore } = collision.colide();

			this.tmpScore = newScore;

			const updatedLineWithNewCurrCell = this.updateLine({
				line: updatedLine,
				currCell: currentCell,
				newCell: newCurrentCell
			});

			updatedLine = this.updateLine({
				line: updatedLineWithNewCurrCell,
				currCell: newNextCell,
				newCell: newNextCell
			});

			switch (this.direction) {
				case 'top':
					this.tmpStartPosition--;
					break;
				case 'bottom':
					this.tmpStartPosition++;
					break;
				case 'left':
					this.tmpStartPosition--;
					break;
				case 'right':
					this.tmpStartPosition++;
					break;
				default:
					break;
			}
		}

		this.getNewStartPosition();

		return this.recursiveMovementLine({
			line: updatedLine
		});
	}

	private getStartPositionFromDirection(): number {
		switch (this.direction) {
			case 'top':
				return 0;
			case 'bottom':
				return MAX_ROW_INDEX;
			case 'left':
				return 0;
			case 'right':
				return MAX_COL_INDEX;
			default:
				return 0;
		}
	}

	private getNewStartPosition() {
		switch (this.direction) {
			case 'top':
				this.startPosition++;
				console.log('this.startPosition++;:', this.startPosition);
				this.tmpStartPosition = this.startPosition;
				console.log('this.tmpStartPosition:', this.tmpStartPosition);
				break;
			case 'bottom':
				this.startPosition--;
				this.tmpStartPosition = this.startPosition;
				break;
			case 'left':
				this.startPosition++;
				this.tmpStartPosition = this.startPosition;
				break;
			case 'right':
				this.startPosition--;
				this.tmpStartPosition = this.startPosition;
				break;
			default:
				break;
		}
	}

	private getCurrentCell(line: Cell[]): Cell | undefined {
		switch (this.direction) {
			case 'top':
				return line.find((cell) => cell.row === this.tmpStartPosition);
			case 'bottom':
				return line.find((cell) => cell.row === this.tmpStartPosition);
			case 'left':
				return line.find((cell) => cell.col === this.tmpStartPosition);
			case 'right':
				return line.find((cell) => cell.col === this.tmpStartPosition);
			default:
				return undefined;
		}
	}

	private getNextCell(line: Cell[], currentCell: Cell): Cell | undefined {
		switch (this.direction) {
			case 'top':
				return line.find((cells) => cells.row === currentCell.row + 1);
			case 'bottom':
				return line.find((cells) => cells.row === currentCell.row - 1);
			case 'left':
				return line.find((cells) => cells.col === currentCell.col + 1);
			case 'right':
				return line.find((cells) => cells.col === currentCell.col - 1);
			default:
				return undefined;
		}
	}

	// todos : OULA ca vas pas
	private updateLine({ line, currCell, newCell }: { line: Cell[]; currCell: Cell; newCell: Cell }) {
		switch (this.direction) {
			case 'top':
				return line.map((cells) => (cells.row === currCell.row ? newCell : cells));
			case 'bottom':
				return line.map((cells) => (cells.row === currCell.row ? newCell : cells));
			case 'left':
				return line.map((cells) => (cells.col === currCell.col ? newCell : cells));
			case 'right':
				return line.map((cells) => (cells.col === currCell.col ? newCell : cells));
			default:
				return line;
		}
	}

	private whileCondition() {
		switch (this.direction) {
			case 'top':
				return this.tmpStartPosition >= 0;
			case 'bottom':
				return this.tmpStartPosition <= MAX_ROW_INDEX;
			case 'left':
				return this.tmpStartPosition >= 0;
			case 'right':
				return this.tmpStartPosition <= MAX_COL_INDEX;
			default:
				return false;
		}
	}

	private getLineFromDirection({ index, grid }: { index: number; grid: Grid }) {
		switch (this.direction) {
			case 'top':
				return grid.cells.filter((cell) => cell.col === index);
			case 'bottom':
				return grid.cells.filter((cell) => cell.col === index);
			case 'left':
				return grid.cells.filter((cell) => cell.row === index);
			case 'right':
				return grid.cells.filter((cell) => cell.row === index);
		}
	}

	private createLoopLineFromDirection(callBack: (index: number) => void) {
		switch (this.direction) {
			case 'top':
				for (let i = 0; i < GRID_COLS_LENGTH; i++) {
					callBack(i);
				}
				break;
			case 'bottom':
				for (let i = MAX_COL_INDEX; i >= 0; i--) {
					callBack(i);
				}
				break;
			case 'left':
				for (let i = 0; i < GRID_ROWS_LENGTH; i++) {
					callBack(i);
				}
				break;
			case 'right':
				for (let i = MAX_COL_INDEX; i >= 0; i--) {
					callBack(i);
				}
				break;
		}
	}
}
