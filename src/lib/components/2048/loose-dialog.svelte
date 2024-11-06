<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let {
		open = $bindable(false),
		onResetGame,
		score
	}: {
		open: boolean;
		onResetGame: () => Promise<void>;
		score: number;
	} = $props();
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content class="border-primary">
		<AlertDialog.Header>
			<AlertDialog.Title>Perdu !</AlertDialog.Title>
			<AlertDialog.Description>
				Votre score est de <strong>{score}</strong> ! Vous avez perdu ! Vous pouvez recommencer.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action
				onclick={async () => {
					await onResetGame();
					open = false;
				}}>Recommencer</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
