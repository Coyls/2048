import type { Cell } from './Cell';
import { Tile } from './Tile';

export const collisionTypes = ['isEmpty', 'isDifferent', 'colide', 'colideWithZero'] as const;
export type CollisionType = (typeof collisionTypes)[number];

export class Collision {
	currentCell: Cell;
	nextCell: Cell;
	score: number;

	constructor(currentCell: Cell, nextCell: Cell, score: number) {
		this.currentCell = currentCell;
		this.nextCell = nextCell;
		this.score = score;
	}

	colide() {
		const type = this.checkCollision();
		return this.colideCells({ type });
	}

	checkCollision(): CollisionType {
		if (this.currentCell.content === null) return 'colideWithZero';
		if (this.nextCell.content === null) return 'isEmpty';
		if (
			this.currentCell.content.value === this.nextCell.content.value &&
			!this.nextCell.content.hasCollided &&
			!this.currentCell.content.hasCollided
		)
			return 'colide';
		return 'isDifferent';
	}

	private colideCells({ type }: { type: CollisionType }): {
		newCurrentCell: Cell;
		newNextCell: Cell;
		newScore: number;
	} {
		switch (type) {
			case 'isEmpty':
				return {
					newCurrentCell: this.currentCell,
					newNextCell: this.nextCell,
					newScore: this.score
				};
			case 'isDifferent':
				return {
					newCurrentCell: this.currentCell,
					newNextCell: this.nextCell,
					newScore: this.score
				};
			case 'colide':
				return {
					newCurrentCell: {
						...this.currentCell,
						content: new Tile([this.currentCell.content!, this.nextCell.content!])
					},
					newNextCell: {
						...this.nextCell,
						content: null
					},
					newScore: this.score + this.currentCell.content!.value + this.nextCell.content!.value
				};
			case 'colideWithZero':
				return {
					newCurrentCell: {
						...this.currentCell,
						content: this.nextCell.content
					},
					newNextCell: {
						...this.nextCell,
						content: null
					},
					newScore: this.score
				};
			default:
				return {
					newCurrentCell: this.currentCell,
					newNextCell: this.nextCell,
					newScore: this.score
				};
		}
	}
}
