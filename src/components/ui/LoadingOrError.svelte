<script lang="ts">
	import { errorStore, loadingStore } from '$lib/stores';
	import { Alert } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	let loading: boolean = false;
	let errorMsg: string | null = null;

	const unsubscribeLoading = loadingStore.subscribe((value) => {
		loading = value;
	});

	const unsubscribeError = errorStore.subscribe((value) => {
		errorMsg = value;
	});

	onDestroy(() => {
		unsubscribeLoading();
		unsubscribeError();
	});
</script>

{#if errorMsg && loading}
	<Alert color="red" class="w-fit fixed right-2 bottom-2" border>Klaida: {errorMsg}</Alert>
	<Alert color="blue" class="w-fit fixed right-2 bottom-20" border>Įkeliama...</Alert>
{:else}
	{#if errorMsg}
		<Alert color="red" class="w-fit fixed right-2 bottom-2" border>Klaida: {errorMsg}</Alert>
	{/if}
	{#if loading}
		<Alert color="blue" class="w-fit fixed right-2 bottom-2" border>Įkeliama...</Alert>
	{/if}
{/if}
