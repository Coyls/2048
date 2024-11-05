<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let {
		open = $bindable(false),
		onResetGame,
		onContinueGame
	}: {
		open: boolean;
		onResetGame: () => Promise<void>;
		onContinueGame: () => void;
	} = $props();
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content class="border-primary">
		<AlertDialog.Header>
			<AlertDialog.Title>Gagné !</AlertDialog.Title>
			<AlertDialog.Description>
				Vous avez gagné ! Vous pouvez recommencer ou continuer.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				onclick={async () => {
					await onResetGame();
					open = false;
				}}>Recommencer</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={() => {
					onContinueGame();
					open = false;
				}}>Continuer</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
