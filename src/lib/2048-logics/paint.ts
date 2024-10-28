import { GRID_COLS_LENGTH, GRID_ROWS_LENGTH, type Grid } from './base';
import { getCellColor } from './cell-color';

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

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const cell = grid.find((cell) => cell.row === i && cell.col === j);

			const cellColor = getCellColor(cell?.value ?? 0);

			context.fillStyle = cellColor;

			const x = j * (CELL_SIZE + GAP_SIZE);
			const y = i * (CELL_SIZE + GAP_SIZE);

			context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
			context.fillStyle = '#5C534A';
			context.fillText(cell?.value.toString() ?? '', x + CELL_SIZE / 2, y + CELL_SIZE / 2);

			// --- DEBUG ---
			// context.fillText(
			// 	`row : ${cell?.row} \n col : ${cell?.col} \n value : ${cell?.value}`,
			// 	x,
			// 	y + CELL_SIZE / 3
			// );
			// --------------
		}
	}
};
