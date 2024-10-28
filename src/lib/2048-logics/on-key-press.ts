import type { Grid } from './base';
import { moveToBottom, moveToLeft, moveToRight, moveToTop } from './move';

export const onKeyPress = ({
	event,
	grid,
	score
}: {
	event: KeyboardEvent;
	grid: Grid;
	score: number;
}) => {
	const key = event.key;

	switch (key) {
		case 'ArrowUp':
			return moveToTop(grid, score);
		case 'ArrowDown':
			return moveToBottom(grid, score);
		case 'ArrowLeft':
			return moveToLeft(grid, score);
		case 'ArrowRight':
			return moveToRight(grid, score);
		default:
			return { grid, score };
	}
};
