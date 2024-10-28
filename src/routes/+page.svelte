<script lang="ts">
	import { getCellAndGapSize, GRID_BASE, MAX_CANVAS_SIZE } from '$lib/2048-logics/base';
	import {
		calculateIfGameIsOver,
		calculateIfGameIsWon
	} from '$lib/2048-logics/calculate-game-over';
	import { onKeyPress } from '$lib/2048-logics/on-key-press';
	import { paint } from '$lib/2048-logics/paint';
	import { addRandomValue } from '$lib/2048-logics/random-value';

	let grid = $state(addRandomValue(GRID_BASE));
	let score = $state(0);
	let canvas: HTMLCanvasElement;

	let isGameOver = $state(false);
	let isGameWon = $state(false);

	$effect(() => {
		window.addEventListener('keyup', (event) => {
			const result = onKeyPress({ event, grid, score });
			grid = result.grid;
			score = result.score;

			isGameOver = calculateIfGameIsOver(grid);
			isGameWon = calculateIfGameIsWon(grid);
		});
	});

	$effect(() => {
		const context = canvas.getContext('2d');
		if (!context) return;

		const { CELL_SIZE, GAP_SIZE } = getCellAndGapSize(canvas.width);

		paint({ context, grid, CELL_SIZE, GAP_SIZE });
	});
</script>

<canvas
	class=" border-[16px] border-gray-300"
	bind:this={canvas}
	width={MAX_CANVAS_SIZE}
	height={MAX_CANVAS_SIZE}
></canvas>

<div class="text-4xl">Score: {score}</div>

{#if isGameOver}
	<div class="absolute left-0 top-0 h-full w-full bg-black/50">
		<h1 class="text-4xl text-white">Game Over</h1>
	</div>
{/if}

{#if isGameWon}
	<div class="absolute left-0 top-0 h-full w-full bg-black/50">
		<h1 class="text-4xl text-white">Game Won</h1>
	</div>
{/if}
