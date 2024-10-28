import type { Cell } from './base';

export const collisionTypes = ['isEmpty', 'isDifferent', 'colide', 'colideWithZero'] as const;
export type CollisionType = (typeof collisionTypes)[number];

export const checkCollision = (cell: Cell, nextCell: Cell): CollisionType => {
	if (cell.value === nextCell.value && !nextCell.hasCollided) return 'colide';
	if (cell.value === 0) return 'colideWithZero';
	if (nextCell.value === 0) return 'isEmpty';
	return 'isDifferent';
};

export const colideCells = ({
	cell,
	nextCell,
	score,
	type
}: {
	cell: Cell;
	nextCell: Cell;
	score: number;
	type: CollisionType;
}): { newCurrentCell: Cell; newNextCell: Cell; newScore: number } => {
	console.log('type:', type);
	switch (type) {
		case 'isEmpty':
			return {
				newCurrentCell: cell,
				newNextCell: nextCell,
				newScore: score
			};
		case 'isDifferent':
			return {
				newCurrentCell: cell,
				newNextCell: nextCell,
				newScore: score
			};
		case 'colide':
			return {
				newCurrentCell: {
					...cell,
					value: cell.value + nextCell.value,
					hasCollided: true
				},
				newNextCell: {
					...nextCell,
					value: 0
				},
				newScore: score + cell.value + nextCell.value
			};
		case 'colideWithZero':
			return {
				newCurrentCell: {
					...cell,
					value: cell.value + nextCell.value
				},
				newNextCell: {
					...nextCell,
					value: 0
				},
				newScore: score
			};
		default:
			return {
				newCurrentCell: cell,
				newNextCell: nextCell,
				newScore: score
			};
	}
};

export const colide = ({
	cell,
	nextCell,
	score
}: {
	cell: Cell;
	nextCell: Cell;
	score: number;
}) => {
	const type = checkCollision(cell, nextCell);

	return colideCells({ cell, nextCell, score, type });
};
