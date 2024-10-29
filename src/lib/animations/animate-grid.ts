import { areSameGrids } from '$lib/2048-logics/are-same-grids';
import type { Grid } from '$lib/2048-logics/base';
import type { DirectionType } from '$lib/2048-logics/utils';

export const animateGrid = ({
	prevGrid,
	newGrid,
	direction
}: {
	prevGrid: Grid;
	newGrid: Grid;
	direction: DirectionType;
}) => {
	if (areSameGrids(prevGrid, newGrid)) return {};
	console.log('direction:', direction);
	// console.log('prevGrid:', prevGrid);
	// console.log('newGrid:', newGrid);

	return {};
};
