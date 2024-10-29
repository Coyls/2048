import { type Cell } from '$lib/2048-logics/base';
import { getCellColorViolet, TEXT_COLOR_VIOLET } from '$lib/2048-logics/cell-color';
import { getCharacterSize } from '$lib/2048-logics/utils';

const FONT_SIZE = 32;

export const paintCell = ({
	context,
	cell,
	CELL_SIZE,
	GAP_SIZE
}: {
	context: CanvasRenderingContext2D;
	cell: Cell;
	CELL_SIZE: number;
	GAP_SIZE: number;
}) => {
	const isEmptyCell = cell.value === 0;

	const x = cell.col * (CELL_SIZE + GAP_SIZE);
	const y = cell.row * (CELL_SIZE + GAP_SIZE);

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

	// ! --- DEBUG --- !
	// context.fillText(
	// 	`row : ${cell?.row} \n col : ${cell?.col} \n value : ${cell?.value}`,
	// 	x,
	// 	y + CELL_SIZE / 3
	// );
	// ! -------------- !
};
