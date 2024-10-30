<script lang="ts">
	import { GRID_BASE, MAX_CANVAS_SIZE } from '$lib/2048-logics/base';
	import { onKeyPress } from '$lib/2048-logics/on-key-press';
	import { addRandomValue } from '$lib/2048-logics/random-value';
	import { Game } from '$lib/oop-2048-logics/Game.svelte';
	import { RotateCcw } from 'lucide-svelte';

	const game = new Game({
		gridRowsLength: 4,
		gridColsLength: 4,
		canvasSize: MAX_CANVAS_SIZE
	});

	const startingGrid = addRandomValue(GRID_BASE);

	let grid = $state(startingGrid);
	let prevGrid = $state(startingGrid);

	const resetGame = () => {
		game.reset();
	};

	$effect(() => {
		const handleKeyUp = (event: KeyboardEvent) => {
			const result = onKeyPress({ event, grid, score: game.score });
			prevGrid = grid;
			grid = result.grid;
			game.score = result.score;
			console.log('result.score:', result.score);
		};

		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	$effect(() => {
		/* const context = game.canvasManager.canvas?.getContext('2d');
		if (!context) return;

		const { CELL_SIZE, GAP_SIZE } = getCellAndGapSize(game.canvasManager.canvasSize);

		paint({ context, grid, CELL_SIZE, GAP_SIZE }); */

		game.canvasManager.paint();
	});
</script>

<main class="mx-auto flex min-h-screen max-w-[500px] flex-col items-center justify-center gap-4">
	<h1 class="text-6xl font-bold">2048</h1>
	<div class="flex w-full flex-row items-center justify-between gap-4">
		<div class="text-4xl">Score: <span class="font-bold"> {game.score}</span></div>
		<button onclick={resetGame} class="rounded-md p-2"><RotateCcw /></button>
	</div>

	<canvas
		bind:this={game.canvasManager.canvas}
		width={game.canvasManager.canvasSize}
		height={game.canvasManager.canvasSize}
	></canvas>
</main>

{#if game.isGameOver}
	<div class="absolute left-0 top-0 h-full w-full bg-black/50">
		<h1 class="text-4xl text-white">Game Over</h1>
	</div>
{/if}

{#if game.isGameWon}
	<div class="absolute left-0 top-0 h-full w-full bg-black/50">
		<h1 class="text-4xl text-white">Game Won</h1>
	</div>
{/if}
