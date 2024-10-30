import { areSameGrids } from './are-same-grids';
import { type Cell, type Grid, GRID_COLS_LENGTH, MAX_COL_INDEX, MAX_ROW_INDEX } from './base';
import { colide } from './collision';
import { addRandomValue } from './random-value';
import { cleanCollidedCells, type DirectionType } from './utils';

export const move = (grid: Grid, score: number, direction: DirectionType) => {
	const updatedGrid: Cell[] = [];
	let tmpScore = score;
	getLoop(direction, (i) => {
		const line = getLineFromDirection({ index: i, direction, grid });

		const updatedLine = recursiveMovementLine({
			line,
			direction,
			startPosition: getStartPosition(direction),
			score: tmpScore
		});
		updatedGrid.push(...updatedLine.newLine);
		tmpScore = updatedLine.newScore;
	});

	const cleanedGrid = cleanCollidedCells(updatedGrid);

	if (areSameGrids(cleanedGrid, grid)) return { grid: cleanedGrid, score: tmpScore };

	return {
		grid: addRandomValue(cleanedGrid),
		score: tmpScore
	};
};

export const recursiveMovementLine = ({
	line,
	direction,
	startPosition,
	score
}: {
	line: Cell[];
	direction: DirectionType;
	startPosition: number;
	score: number;
}): { newLine: Cell[]; newScore: number } => {
	let tmpStartPostion = startPosition;
	let updatedLine = line;
	let tmpNewScore = score;

	while (whileCondition(tmpStartPostion, direction)) {
		const currentCell = getCurrentCell(updatedLine, tmpStartPostion, direction);
		if (!currentCell) return { newLine: updatedLine, newScore: tmpNewScore };
		const nextCell = getNextCell(updatedLine, currentCell, direction);
		if (!nextCell) return { newLine: updatedLine, newScore: tmpNewScore };

		const { newCurrentCell, newNextCell, newScore } = colide({
			cell: currentCell,
			nextCell,
			score: tmpNewScore
		});

		// !! DEBUG !!
		// console.log('currCell:', currCell);
		// console.log('nextCell:', nextCell);
		// console.log('newCurrCell:', newCurrCell);
		// console.log('newNextCell:', newNextCell);
		// console.log('newScore:', newScore);

		tmpNewScore = newScore;

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
		startPosition: newStartPosition,
		score: tmpNewScore
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

export const getLineFromDirection = ({
	index,
	direction,
	grid
}: {
	index: number;
	direction: DirectionType;
	grid: Grid;
}) => {
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
};

export const getLoop = (direction: DirectionType, callBack: (i: number) => void) => {
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
			for (let i = 0; i < GRID_COLS_LENGTH; i++) {
				callBack(i);
			}
			break;
		case 'right':
			for (let i = MAX_COL_INDEX; i >= 0; i--) {
				callBack(i);
			}
			break;
	}
};
