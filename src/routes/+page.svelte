<script lang="ts">
	import { getCellAndGapSize, GRID_BASE, MAX_CANVAS_SIZE } from '$lib/2048-logics/base';
	import { onKeyPress } from '$lib/2048-logics/on-key-press';
	import { paint } from '$lib/2048-logics/paint';
	import { addRandomValue } from '$lib/2048-logics/random-value';

	let grid = $state(addRandomValue(GRID_BASE));
	let canvas: HTMLCanvasElement;

	let isGameOver = $state(false);
	let isGameWon = $state(false);

	$effect(() => {
		window.addEventListener('keydown', (event) => {
			grid = onKeyPress(event, grid);
		});
	});

	$effect(() => {
		const context = canvas.getContext('2d');
		if (!context) return;

		const { CELL_SIZE, GAP_SIZE } = getCellAndGapSize(canvas.width);

		const result = paint({ context, grid, CELL_SIZE, GAP_SIZE });

		isGameOver = result.isGameOver;
		isGameWon = result.isGameWon;
	});
</script>

<canvas
	class=" border-[16px] border-gray-300"
	bind:this={canvas}
	width={MAX_CANVAS_SIZE}
	height={MAX_CANVAS_SIZE}
></canvas>

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
