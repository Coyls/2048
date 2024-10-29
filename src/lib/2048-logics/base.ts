export type Cell = {
	value: number;
	row: number;
	col: number;
	hasCollided: boolean;
};

export const GRID_ROWS_LENGTH = 4;
export const GRID_COLS_LENGTH = 4;
export const MAX_ROW_INDEX = GRID_ROWS_LENGTH - 1;
export const MAX_COL_INDEX = GRID_COLS_LENGTH - 1;

export const GRID_BASE = Array.from({ length: GRID_ROWS_LENGTH }, (_, i) =>
	Array.from({ length: GRID_COLS_LENGTH }, (_, j) => ({
		value: 0,
		row: i,
		col: j,
		hasCollided: false
	}))
).flat();

export type Grid = Cell[];

export const MAX_CANVAS_SIZE = 500;
export const CELL_PADDING = 16;

export const getCellAndGapSize = (canvasSize: number): { CELL_SIZE: number; GAP_SIZE: number } => {
	// Calculer y en utilisant la relation y = x / 5
	// Substituer y dans l'équation 4x + 3y = n
	// 4x + 3(x/5) = n
	const CELL_SIZE = (5 * canvasSize) / 23; // Simplification de l'équation
	const GAP_SIZE = CELL_SIZE / 5; // Calcul de y

	return { CELL_SIZE, GAP_SIZE };
};
