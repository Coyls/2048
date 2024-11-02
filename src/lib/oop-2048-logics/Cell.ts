import type { Tile } from './Tile';

export class Cell {
	row: number;
	col: number;
	content: Tile | null;

	constructor(row: number, col: number, content: Tile | null) {
		this.row = row;
		this.col = col;
		this.content = content ?? null;
	}
}
