import { Cell } from './Cell';

export class Grid {
	gridRowsLength: number;
	gridColsLength: number;
	cells: Cell[] = [];

	constructor(gridRowsLength: number, gridColsLength: number) {
		this.gridRowsLength = gridRowsLength;
		this.gridColsLength = gridColsLength;
		this.cells = this.initGrid(gridRowsLength, gridColsLength);
	}

	private initGrid(gridRowsLength: number, gridColsLength: number) {
		return Array.from({ length: gridRowsLength }, (_, row) =>
			Array.from({ length: gridColsLength }, (_, col) => new Cell(row, col, null))
		).flat();
	}
}
