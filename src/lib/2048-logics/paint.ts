import { GRID_COLS_LENGTH, GRID_ROWS_LENGTH, type Grid } from './base';
import { getCellColorViolet, TEXT_COLOR_VIOLET } from './cell-color';
import { getCharacterSize } from './utils';

const FONT_SIZE = 32;

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

	context.font = `bold ${FONT_SIZE}px arial`;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const cell = grid.find((cell) => cell.row === i && cell.col === j)!;

			const isEmptyCell = cell.value === 0;

			const x = j * (CELL_SIZE + GAP_SIZE);
			const y = i * (CELL_SIZE + GAP_SIZE);

			const cellColor = getCellColorViolet(cell.value);
			context.fillStyle = cellColor;
			context.beginPath();
			context.roundRect(x, y, CELL_SIZE, CELL_SIZE, 10);
			context.fill();

			context.fillStyle = TEXT_COLOR_VIOLET;
			context.fillText(
				isEmptyCell ? '' : cell.value.toString(),
				x + CELL_SIZE / 2 - (getCharacterSize(cell.value) * FONT_SIZE) / 4,
				y + CELL_SIZE / 2 + FONT_SIZE / 4
			);

			// --- DEBUG ---
			// context.fillText(
			// 	`row : ${cell?.row} \n col : ${cell?.col} \n value : ${cell?.value}`,
			// 	x,
			// 	y + CELL_SIZE / 3
			// );
			// --------------
		}
	}

	return {};
};
