import type { Grid } from './base';
import { move } from './move';

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
			return move(grid, score, 'top');
		case 'ArrowDown':
			return move(grid, score, 'bottom');
		case 'ArrowLeft':
			return move(grid, score, 'left');
		case 'ArrowRight':
			return move(grid, score, 'right');
		default:
			return { grid, score };
	}
};
