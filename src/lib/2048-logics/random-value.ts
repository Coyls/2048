import type { Grid } from './base';
import { replaceCellValue } from './utils';

export const addRandomValue = (grid: Grid) => {
	const allEmptyCells = grid.filter((cell) => cell.value === 0);

	const randomEmptyCell = allEmptyCells[Math.floor(Math.random() * allEmptyCells.length)];

	const newValue = Math.random() < 0.9 ? 2 : 4;

	return replaceCellValue(grid, { ...randomEmptyCell, value: newValue });
};
