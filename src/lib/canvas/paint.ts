import { animateGrid } from '$lib/animations/animate-grid';
import { GRID_COLS_LENGTH, GRID_ROWS_LENGTH, type Grid } from '../2048-logics/base';
import { paintCell } from './paint-cell';

const FONT_SIZE = 32;

export const paint = ({
	context,
	CELL_SIZE,
	GAP_SIZE,
	grid,
	prevGrid
}: {
	context: CanvasRenderingContext2D;
	CELL_SIZE: number;
	GAP_SIZE: number;
	grid: Grid;
	prevGrid: Grid;
}) => {
	context.font = `bold ${FONT_SIZE}px arial`;

	animateGrid({ prevGrid, newGrid: grid });

	for (let i = 0; i < GRID_ROWS_LENGTH; i++) {
		for (let j = 0; j < GRID_COLS_LENGTH; j++) {
			const cell = grid.find((cell) => cell.row === i && cell.col === j)!;

			paintCell({ context, cell, CELL_SIZE, GAP_SIZE });
		}
	}

	return {};
};
