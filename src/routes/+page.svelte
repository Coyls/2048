<script lang="ts">
	import { Game } from '$lib/oop-2048-logics/Game.svelte';
	import { WinDialog } from '@/lib/components/2048';
	import LooseDialog from '@/lib/components/2048/loose-dialog.svelte';
	import { Button } from '@/lib/components/ui/button';
	import { MAX_CANVAS_SIZE } from '@/lib/oop-2048-logics/CanvasManager.svelte';
	import type { SwipeDirection } from '@/lib/oop-2048-logics/KeyManager';
	import { RotateCcw } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// l'angoisse !!
	if (typeof window !== 'undefined') {
		import('swiped-events');
	}

	// ! La lib utiliser pour les swipe n'est pas typée
	type CustomEvent = Event & {
		detail: {
			dir: SwipeDirection;
		};
	};

	export const OFFSET_CANVAS_SIZE = 32;

	const game = new Game({
		gridRowsLength: 4,
		gridColsLength: 4,
		canvasSize: MAX_CANVAS_SIZE
	});

	const resetGame = async () => {
		game.reset();
		await game.canvasManager.draw();
	};

	const setCanvasSize = async () => {
		game.canvasManager.onResize(
			window.screen.width < MAX_CANVAS_SIZE
				? window.screen.width - OFFSET_CANVAS_SIZE
				: MAX_CANVAS_SIZE
		);
		await game.canvasManager.draw();
	};

	onMount(async () => {
		game.initHighScoreLocalStorage(window.localStorage);
		game.getHighScore();
		game.canvasManager.context = game.canvasManager.canvas?.getContext('2d') ?? null;
		await setCanvasSize();
	});

	$effect(() => {
		const handleSwipe = (event: Event) => {
			const customEvent = event as CustomEvent;
			game.keyManager.handleSwipe(customEvent.detail.dir);
		};

		document.addEventListener('swiped', handleSwipe);
		return () => {
			document.removeEventListener('swiped', handleSwipe);
		};
	});

	$effect(() => {
		const handleResize = async () => {
			if (window.screen.width >= MAX_CANVAS_SIZE) return;
			await setCanvasSize();
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		const handleKeyUp = async (event: KeyboardEvent) => {
			await game.keyManager.handleKeyUp(event);
		};

		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	});
</script>

<main class="mx-auto flex min-h-svh max-w-[500px] flex-col items-center justify-center gap-4">
	<h1 class="text-6xl font-bold">2048</h1>
	<div class="flex w-full flex-row items-center justify-between gap-4 px-4 md:px-0">
		<div class="flex flex-col">
			<div class=" text-3xl">Score: <span class="font-bold">{game.score}</span></div>
			<div class=" text-3xl">
				High Score: <span class="font-bold">{game.displayHighScore()}</span>
			</div>
		</div>
		<Button class="self-end" size="icon" onclick={resetGame} variant="ghost">
			<RotateCcw size={24} class="text-primary" />
		</Button>
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

<WinDialog onResetGame={resetGame} onContinueGame={game.continueGame} open={game.isGameWon} />
<LooseDialog score={game.score} onResetGame={resetGame} open={game.isGameOver} />
