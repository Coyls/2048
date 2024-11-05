<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let {
		open = $bindable(false),
		onResetGame
	}: {
		open: boolean;
		onResetGame: () => Promise<void>;
	} = $props();
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content class="border-primary">
		<AlertDialog.Header>
			<AlertDialog.Title>Perdu !</AlertDialog.Title>
			<AlertDialog.Description>Vous avez perdu ! Vous pouvez recommencer.</AlertDialog.Description>
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
