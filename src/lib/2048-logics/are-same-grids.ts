import type { Grid } from './base';

export const areSameGrids = (grid1: Grid, grid2: Grid) => {
	return grid1.every((cell, index) => cell.value === grid2[index].value);
};
