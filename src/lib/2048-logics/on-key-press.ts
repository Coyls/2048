import type { Grid } from './base';
import { moveToBottom, moveToLeft, moveToRight, moveToTop } from './move';

export const onKeyPress = (event: KeyboardEvent, grid: Grid) => {
	const key = event.key;

	switch (key) {
		case 'ArrowUp':
			console.log('up');
			return moveToTop(grid);
		case 'ArrowDown':
			console.log('down');
			return moveToBottom(grid);
		case 'ArrowLeft':
			console.log('left');
			return moveToLeft(grid);
		case 'ArrowRight':
			console.log('right');
			return moveToRight(grid);
		default:
			return grid;
	}
};
