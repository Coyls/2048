import { Cell } from './Cell';
import { Tile } from './Tile';

export class Grid {
	gridRowsLength: number;
	gridColsLength: number;
	cells: Cell[] = [];

	constructor(gridRowsLength: number, gridColsLength: number) {
		this.gridRowsLength = gridRowsLength;
		this.gridColsLength = gridColsLength;
		this.cells = this.initGridWithEmptyCells(gridRowsLength, gridColsLength);
	}

	static areSameGrids(grid1: Grid, grid2: Grid) {
		return grid1.cells.every((cell1) => {
			const cell2 = grid2.cells.find((cell) => cell.row === cell1.row && cell.col === cell1.col);
			return cell2 && cell1.content === cell2.content;
		});
	}

	addRandomTile() {
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

	clone() {
		const newClonedGrid = new Grid(this.gridRowsLength, this.gridColsLength);
		newClonedGrid.cells = this.cells.map((cell) => new Cell(cell.row, cell.col, cell.content));
		return newClonedGrid;
	}

	private initGridWithEmptyCells(gridRowsLength: number, gridColsLength: number) {
		return Array.from({ length: gridRowsLength }, (_, row) =>
			Array.from({ length: gridColsLength }, (_, col) => new Cell(row, col, null))
		).flat();
	}
}
