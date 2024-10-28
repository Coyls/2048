import { GRID_COLS_LENGTH, GRID_ROWS_LENGTH, type Grid } from './base';
import { checkCollision, type CollisionType } from './collision';

export const WIN_CONDITION = 2048;

export const calculateIfGameIsOver = (grid: Grid): boolean => {
	const allColisionTypePossible: CollisionType[] = [];

	for (let i = 0; i < GRID_ROWS_LENGTH; i++) {
		for (let j = 0; j < GRID_COLS_LENGTH; j++) {
			const cell = grid.find((cell) => cell.row === i && cell.col === j)!;
			const nextRowCell = grid.find((cell) => cell.row === i + 1 && cell.col === j);
			const nextColCell = grid.find((cell) => cell.row === i && cell.col === j + 1);

			if (nextRowCell) allColisionTypePossible.push(checkCollision(cell, nextRowCell));
			if (nextColCell) allColisionTypePossible.push(checkCollision(cell, nextColCell));
		}
	}

	const gameIsOver = allColisionTypePossible.every((type) => type === 'isDifferent');

	return gameIsOver;
};

export const calculateIfGameIsWon = (grid: Grid): boolean => {
	const gameIsWon = grid.some((cell) => cell.value === WIN_CONDITION);

	return gameIsWon;
};
