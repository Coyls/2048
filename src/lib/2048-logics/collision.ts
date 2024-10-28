import type { Cell } from './base';

export const collisionTypes = ['isEmpty', 'isDifferent', 'colide', 'colideWithZero'] as const;
export type CollisionType = (typeof collisionTypes)[number];

export const checkCollision = (cell: number, nextCell: number): CollisionType => {
	if (cell === nextCell) return 'colide';
	if (cell === 0) return 'colideWithZero';
	if (nextCell === 0) return 'isEmpty';
	return 'isDifferent';
};

export const colideCells = (
	cell: Cell,
	nextCell: Cell,
	type: CollisionType
): { newCurrCell: Cell; newNextCell: Cell } => {
	switch (type) {
		case 'isEmpty':
			return {
				newCurrCell: cell,
				newNextCell: nextCell
			};
		case 'isDifferent':
			return {
				newCurrCell: cell,
				newNextCell: nextCell
			};
		case 'colide':
			return {
				newCurrCell: {
					...cell,
					value: cell.value + nextCell.value
				},
				newNextCell: {
					...nextCell,
					value: 0
				}
			};
		case 'colideWithZero':
			return {
				newCurrCell: {
					...cell,
					value: cell.value + nextCell.value
				},
				newNextCell: {
					...nextCell,
					value: 0
				}
			};
		default:
			return {
				newCurrCell: cell,
				newNextCell: nextCell
			};
	}
};

export const colide = (cell: Cell, nextCell: Cell) =>
	colideCells(cell, nextCell, checkCollision(cell.value, nextCell.value));
