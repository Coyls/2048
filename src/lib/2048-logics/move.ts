import { areSameGrids } from './are-same-grids';
import { type Cell, type Grid, GRID_COLS_LENGTH, MAX_COL_INDEX, MAX_ROW_INDEX } from './base';
import { colide } from './collision';
import { addRandomValue } from './random-value';
import type { DirectionType } from './utils';

export const moveToTop = (grid: Grid) => {
	const updatedGrid: Cell[] = [];
	for (let i = 0; i < GRID_COLS_LENGTH; i++) {
		const line = grid.filter((cell) => cell.col === i);

		const updatedLine = recursiveMovementLine({
			line: line,
			direction: 'top',
			startPosition: getStartPosition('top')
		});
		updatedGrid.push(...updatedLine);
	}

	if (areSameGrids(updatedGrid, grid)) return updatedGrid;

	return addRandomValue(updatedGrid);
};

export const moveToBottom = (grid: Grid) => {
	const updatedGrid: Cell[] = [];
	for (let i = MAX_COL_INDEX; i >= 0; i--) {
		const line = grid.filter((cell) => cell.col === i);

		const updatedLine = recursiveMovementLine({
			line: line,
			direction: 'bottom',
			startPosition: getStartPosition('bottom')
		});
		updatedGrid.push(...updatedLine);
	}

	if (areSameGrids(updatedGrid, grid)) return updatedGrid;

	return addRandomValue(updatedGrid);
};

export const moveToLeft = (grid: Grid) => {
	const updatedGrid: Cell[] = [];
	for (let i = 0; i < GRID_COLS_LENGTH; i++) {
		const line = grid.filter((cell) => cell.row === i);

		const updatedLine = recursiveMovementLine({
			line: line,
			direction: 'left',
			startPosition: getStartPosition('left')
		});
		updatedGrid.push(...updatedLine);
	}

	if (areSameGrids(updatedGrid, grid)) return updatedGrid;

	return addRandomValue(updatedGrid);
};

export const moveToRight = (grid: Grid) => {
	const updatedGrid: Cell[] = [];
	for (let i = MAX_COL_INDEX; i >= 0; i--) {
		const line = grid.filter((cell) => cell.row === i);

		const updatedLine = recursiveMovementLine({
			line: line,
			direction: 'right',
			startPosition: getStartPosition('right')
		});
		updatedGrid.push(...updatedLine);
	}

	if (areSameGrids(updatedGrid, grid)) return updatedGrid;

	return addRandomValue(updatedGrid);
};

export const recursiveMovementLine = ({
	line,
	direction,
	startPosition
}: {
	line: Cell[];
	direction: DirectionType;
	startPosition: number;
}): Cell[] => {
	let tmpStartPostion = startPosition;
	let updatedLine = line;

	while (whileCondition(tmpStartPostion, direction)) {
		const currentCell = getCurrentCell(updatedLine, tmpStartPostion, direction);
		if (!currentCell) return updatedLine;
		const nextCell = getNextCell(updatedLine, currentCell, direction);
		if (!nextCell) return updatedLine;

		const { newCurrCell: newCurrentCell, newNextCell } = colide(currentCell, nextCell);

		// console.log('currCell:', currCell);
		// console.log('nextCell:', nextCell);
		// console.log('newCurrCell:', newCurrCell);
		// console.log('newNextCell:', newNextCell);

		const updatedLineWithNewCurrCell = updateLine({
			line: updatedLine,
			currCell: currentCell,
			newCell: newCurrentCell,
			direction
		});

		updatedLine = updateLine({
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

	const newStartPosition = getNewStartPosition(startPosition, direction);

	return recursiveMovementLine({
		line: updatedLine,
		direction,
		startPosition: newStartPosition
	});
};

export const getStartPosition = (direction: DirectionType): number => {
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
};

export const getNewStartPosition = (position: number, direction: DirectionType): number => {
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
};

export const getCurrentCell = (
	line: Cell[],
	startPosition: number,
	direction: DirectionType
): Cell | undefined => {
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
};

export const getNextCell = (
	line: Cell[],
	currentCell: Cell,
	direction: DirectionType
): Cell | undefined => {
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
};

export const updateLine = ({
	line,
	currCell,
	newCell,
	direction
}: {
	line: Cell[];
	currCell: Cell;
	newCell: Cell;
	direction: DirectionType;
}) => {
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
};

export const whileCondition = (startPosition: number, direction: DirectionType) => {
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
};
