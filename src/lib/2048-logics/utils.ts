import type { Cell, Grid } from './base';

export const directionTypes = ['top', 'bottom', 'left', 'right'] as const;
export type DirectionType = (typeof directionTypes)[number];

export const replaceCellValue = (grid: Grid, cell: Cell) => {
	const targetCell = grid.find((c) => c.row === cell.row && c.col === cell.col);
	if (!targetCell) return grid;

	targetCell.value = cell.value;

	return grid;
};

export const cleanCollidedCells = (grid: Grid): Cell[] => {
	return grid.map((cell) => ({ ...cell, hasCollided: false }));
};

export const getNextCell = (cell: Cell, direction: DirectionType): Cell => {
	switch (direction) {
		case 'top':
			return {
				...cell,
				row: cell.row + 1
			};
		case 'bottom':
			return {
				...cell,
				row: cell.row - 1
			};
		case 'left':
			return {
				...cell,
				col: cell.col + 1
			};
		case 'right':
			return {
				...cell,
				col: cell.col - 1
			};
		default:
			return cell;
	}
};

export const getRowsFromGrid = (grid: Grid): Cell[][] => {
	return grid.reduce(
		(acc, cell) => {
			acc[cell.row].push(cell);
			return acc;
		},
		[[]] as Cell[][]
	);
};

export const getCharacterSize = (value: number) => {
	const textSize = value.toString().split('').length;
	return textSize;
};
