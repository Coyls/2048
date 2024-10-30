import { areSameGrids } from '../2048-logics/are-same-grids';
import {
	GRID_COLS_LENGTH,
	GRID_ROWS_LENGTH,
	MAX_COL_INDEX,
	MAX_ROW_INDEX
} from '../2048-logics/base';
import { colide } from '../2048-logics/collision';
import { addRandomValue } from '../2048-logics/random-value';
import { cleanCollidedCells, type DirectionType } from '../2048-logics/utils';

import { Cell } from './Cell';
import { Grid } from './Grid';

export class Movement {
	static move(grid: Grid, score: number, direction: DirectionType) {
		const updatedGrid: Grid = new Grid(grid.gridRowsLength, grid.gridColsLength);
		let tmpScore = score;
		this.createLoopLineFromDirection(direction, (index) => {
			const line = this.getLineFromDirection({ index, direction, grid });

			const updatedLine = this.recursiveMovementLine({
				line,
				direction,
				startPosition: this.getStartPositionFromDirection(direction),
				score: tmpScore
			});
			updatedGrid.cells.push(...updatedLine.newLine);
			tmpScore = updatedLine.newScore;
		});

		const cleanedGrid = cleanCollidedCells(updatedGrid);

		if (areSameGrids(cleanedGrid, grid)) return { grid: cleanedGrid, score: tmpScore };

		return {
			grid: addRandomValue(cleanedGrid),
			score: tmpScore
		};
	}

	static recursiveMovementLine({
		line,
		direction,
		startPosition,
		score
	}: {
		line: Cell[];
		direction: DirectionType;
		startPosition: number;
		score: number;
	}): { newLine: Cell[]; newScore: number } {
		let tmpStartPostion = startPosition;
		let updatedLine = line;
		let tmpNewScore = score;

		while (this.whileCondition(tmpStartPostion, direction)) {
			const currentCell = this.getCurrentCell(updatedLine, tmpStartPostion, direction);
			if (!currentCell) return { newLine: updatedLine, newScore: tmpNewScore };
			const nextCell = this.getNextCell(updatedLine, currentCell, direction);
			if (!nextCell) return { newLine: updatedLine, newScore: tmpNewScore };

			const { newCurrentCell, newNextCell, newScore } = colide({
				cell: currentCell,
				nextCell,
				score: tmpNewScore
			});

			tmpNewScore = newScore;

			const updatedLineWithNewCurrCell = this.updateLine({
				line: updatedLine,
				currCell: currentCell,
				newCell: newCurrentCell,
				direction
			});

			updatedLine = this.updateLine({
				line: updatedLineWithNewCurrCell,
				currCell: newNextCell,
				newCell: newNextCell,
				direction
			});

			switch (direction) {
				case 'top':
					tmpStartPostion--;
					break;
				case 'bottom':
					tmpStartPostion++;
					break;
				case 'left':
					tmpStartPostion--;
					break;
				case 'right':
					tmpStartPostion++;
					break;
				default:
					break;
			}
		}

		const newStartPosition = this.getNewStartPosition(startPosition, direction);

		return this.recursiveMovementLine({
			line: updatedLine,
			direction,
			startPosition: newStartPosition,
			score: tmpNewScore
		});
	}

	static getStartPositionFromDirection(direction: DirectionType): number {
		switch (direction) {
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

	static getNewStartPosition(position: number, direction: DirectionType): number {
		switch (direction) {
			case 'top':
				return position + 1;
			case 'bottom':
				return position - 1;
			case 'left':
				return position + 1;
			case 'right':
				return position - 1;
			default:
				return 0;
		}
	}

	static getCurrentCell(
		line: Cell[],
		startPosition: number,
		direction: DirectionType
	): Cell | undefined {
		switch (direction) {
			case 'top':
				return line.find((cell) => cell.row === startPosition);
			case 'bottom':
				return line.find((cell) => cell.row === startPosition);
			case 'left':
				return line.find((cell) => cell.col === startPosition);
			case 'right':
				return line.find((cell) => cell.col === startPosition);
			default:
				return undefined;
		}
	}

	static getNextCell(line: Cell[], currentCell: Cell, direction: DirectionType): Cell | undefined {
		switch (direction) {
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

	static updateLine({
		line,
		currCell,
		newCell,
		direction
	}: {
		line: Cell[];
		currCell: Cell;
		newCell: Cell;
		direction: DirectionType;
	}) {
		switch (direction) {
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

	static whileCondition(startPosition: number, direction: DirectionType) {
		switch (direction) {
			case 'top':
				return startPosition >= 0;
			case 'bottom':
				return startPosition <= MAX_ROW_INDEX;
			case 'left':
				return startPosition >= 0;
			case 'right':
				return startPosition <= MAX_COL_INDEX;
			default:
				return false;
		}
	}

	static getLineFromDirection({
		index,
		direction,
		grid
	}: {
		index: number;
		direction: DirectionType;
		grid: Grid;
	}) {
		switch (direction) {
			case 'top':
				return grid.filter((cell) => cell.col === index);
			case 'bottom':
				return grid.filter((cell) => cell.col === index);
			case 'left':
				return grid.filter((cell) => cell.row === index);
			case 'right':
				return grid.filter((cell) => cell.row === index);
		}
	}

	static createLoopLineFromDirection(direction: DirectionType, callBack: (index: number) => void) {
		switch (direction) {
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
