<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let {
		open = $bindable(false),
		onResetGame
	}: { open: boolean; onResetGame: () => Promise<void> } = $props();
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content>
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
			<AlertDialog.Action onclick={() => (open = false)}>Continuer</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
