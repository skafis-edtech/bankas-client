<script lang="ts">
	import SourceEditForm from '$components/edit-source/SourceEditForm.svelte';
	import type { SourceSubmitDto } from '$services/gen-client';
	import { Button, Modal } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isOpen;
	export let sourceData: SourceSubmitDto;
	export let isSourceDataChanged;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('closeModal');
	}

	function saveSourceChanges() {
		dispatch('saveSourceChanges');
	}
</script>

<Modal open={isOpen} on:close={closeModal} size="xl">
	<SourceEditForm bind:sourceData />
	<div class="flex flex-row justify-end">
		<Button disabled={!isSourceDataChanged} color="blue" on:click={saveSourceChanges} class="w-fit">
			Išsaugoti
		</Button>
	</div>
</Modal>
