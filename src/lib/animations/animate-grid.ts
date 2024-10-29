import { areSameGrids } from '$lib/2048-logics/are-same-grids';
import type { Grid } from '$lib/2048-logics/base';

export const animateGrid = ({ prevGrid, newGrid }: { prevGrid: Grid; newGrid: Grid }) => {
	if (areSameGrids(prevGrid, newGrid)) return {};
	console.log('prevGrid:', prevGrid);
	console.log('newGrid:', newGrid);

	return {};
};
