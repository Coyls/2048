import { Cell } from './Cell';
import { Tile } from './Tile';

export class Grid {
	gridRowsLength: number;
	gridColsLength: number;
	cells: Cell[] = [];

	constructor(gridRowsLength: number, gridColsLength: number) {
		this.gridRowsLength = gridRowsLength;
		this.gridColsLength = gridColsLength;
		this.cells = this.initGrid(gridRowsLength, gridColsLength);
		this.addRandomValue();
	}

	static areSameGrids(grid1: Grid, grid2: Grid) {
		return grid1.cells.every((cell1) => {
			const cell2 = grid2.cells.find((cell) => cell.row === cell1.row && cell.col === cell1.col);
			return cell2 && cell1.content === cell2.content;
		});
	}

	addRandomValue() {
		const emptyCells = this.cells.filter((cell) => cell.content === null);
		const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		randomEmptyCell.content = new Tile();
		return randomEmptyCell;
	}

	cleanCollidedCells() {
		for (const cell of this.cells) {
			if (cell.content) cell.content.cleanCollided();
		}
	}

	private initGrid(gridRowsLength: number, gridColsLength: number) {
		return Array.from({ length: gridRowsLength }, (_, row) =>
			Array.from({ length: gridColsLength }, (_, col) => new Cell(row, col, null))
		).flat();
	}
}
