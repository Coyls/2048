import { GRID_COLS_LENGTH, GRID_ROWS_LENGTH, type Grid } from './base';
import { getCellColor, TEXT_COLOR } from './cell-color';

const WIN_CONDITION = 2048;

export const paint = ({
	context,
	CELL_SIZE,
	GAP_SIZE,
	grid
}: {
	context: CanvasRenderingContext2D;
	CELL_SIZE: number;
	GAP_SIZE: number;
	grid: Grid;
}) => {
	const rows = GRID_ROWS_LENGTH;
	const cols = GRID_COLS_LENGTH;

	const isGameOver = false;
	let isGameWon = false;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const cell = grid.find((cell) => cell.row === i && cell.col === j)!;

			const isEmptyCell = cell.value === 0;

			const cellColor = getCellColor(cell.value);
			context.fillStyle = cellColor;

			const x = j * (CELL_SIZE + GAP_SIZE);
			const y = i * (CELL_SIZE + GAP_SIZE);

			context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
			context.fillStyle = TEXT_COLOR;
			context.fillText(
				isEmptyCell ? '' : cell.value.toString(),
				x + CELL_SIZE / 2,
				y + CELL_SIZE / 2
			);

			if (cell.value === WIN_CONDITION) isGameWon = true;
			// if (isEmptyCell) isGameOver = true;

			// --- DEBUG ---
			// context.fillText(
			// 	`row : ${cell?.row} \n col : ${cell?.col} \n value : ${cell?.value}`,
			// 	x,
			// 	y + CELL_SIZE / 3
			// );
			// --------------
		}
	}

	return { isGameOver, isGameWon };
};
