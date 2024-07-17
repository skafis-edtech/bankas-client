<script lang="ts">
	import { errorStore, loadingStore, successStore } from '$lib/stores';
	import { Alert } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';

	let loading: boolean = false;
	let errorMsg: string | null = null;
	let successMsg: string | null = null;
	let successTimeout: NodeJS.Timeout | null = null;

	const unsubscribeLoading = loadingStore.subscribe((value) => {
		loading = value;
	});

	const unsubscribeError = errorStore.subscribe((value) => {
		errorMsg = value;
	});

	const unsubscribeSuccess = successStore.subscribe((value) => {
		if (successTimeout) {
			clearTimeout(successTimeout);
		}
		successMsg = value;
		if (value) {
			successTimeout = setTimeout(() => {
				successMsg = null;
				successStore.set(null);
			}, 3000);
		}
	});

	onDestroy(() => {
		unsubscribeLoading();
		unsubscribeError();
		unsubscribeSuccess();
		if (successTimeout) {
			clearTimeout(successTimeout);
		}
	});
</script>

{#if errorMsg}
	<Alert dismissable color="red" class="w-fit fixed right-2 bottom-2" border
		>Klaida: {errorMsg}</Alert
	>
{/if}
{#if loading}
	<Alert color="blue" class="w-fit fixed right-2 bottom-{errorMsg ? '7' : '2'}" border
		>Įkeliama...</Alert
	>
{/if}
{#if successMsg}
	<Alert
		dismissable
		color="green"
		class="w-fit fixed right-2 bottom-{errorMsg ? (loading ? '12' : '7') : loading ? '7' : '2'}"
		border>Pateikta: {successMsg}</Alert
	>
{/if}
