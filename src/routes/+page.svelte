<script lang="ts">
	import { getCellAndGapSize, GRID_BASE, MAX_CANVAS_SIZE } from '$lib/2048-logics/base';
	import {
		calculateIfGameIsOver,
		calculateIfGameIsWon
	} from '$lib/2048-logics/calculate-game-over';
	import { onKeyPress } from '$lib/2048-logics/on-key-press';
	import { paint } from '$lib/canvas/paint';
	import { addRandomValue } from '$lib/2048-logics/random-value';
	import { RotateCcw } from 'lucide-svelte';

	const startingGrid = addRandomValue(GRID_BASE);

	let grid = $state(startingGrid);
	let prevGrid = $state(startingGrid);
	let score = $state(0);
	let canvas: HTMLCanvasElement;

	let isGameOver = $state(false);
	let isGameWon = $state(false);

	const resetGame = () => {
		const newStartingGrid = addRandomValue(GRID_BASE.map((cell) => ({ ...cell, value: 0 })));
		prevGrid = newStartingGrid;
		grid = newStartingGrid;
		score = 0;
		isGameOver = false;
		isGameWon = false;
	};

	$effect(() => {
		window.addEventListener('keyup', (event) => {
			const result = onKeyPress({ event, grid, score });
			prevGrid = grid;
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

		paint({ context, grid, prevGrid, CELL_SIZE, GAP_SIZE });
	});
</script>

<main class="mx-auto flex min-h-screen max-w-[500px] flex-col items-center justify-center gap-4">
	<h1 class="text-6xl font-bold">2048</h1>
	<div class="flex w-full flex-row items-center justify-between gap-4">
		<div class="text-4xl">Score: <span class="font-bold"> {score}</span></div>
		<button onclick={resetGame} class="rounded-md p-2"><RotateCcw /></button>
	</div>

	<canvas bind:this={canvas} width={MAX_CANVAS_SIZE} height={MAX_CANVAS_SIZE}></canvas>
</main>

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
