import type { Cell } from './base';

export const collisionTypes = ['isEmpty', 'isDifferent', 'colide', 'colideWithZero'] as const;
export type CollisionType = (typeof collisionTypes)[number];

export const checkCollision = (cell: Cell, nextCell: Cell): CollisionType => {
	if (cell.value === nextCell.value && !nextCell.hasCollided) return 'colide';
	if (cell.value === 0) return 'colideWithZero';
	if (nextCell.value === 0) return 'isEmpty';
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
					value: cell.value + nextCell.value,
					hasCollided: true
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
	colideCells(cell, nextCell, checkCollision(cell, nextCell));
