<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { ROLES } from '$utils/constants';
	import CategoryToReview from '$components/ui/CategoryToReview.svelte';
	import { onMount } from 'svelte';
	import type { UnderReviewCategory } from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import { Accordion } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let loading = true;
	let error = '';

	let underReviewCategories: UnderReviewCategory[] = [];

	let operationDone = writable(false);

	onMount(async () => {
		try {
			const response = await categoryApi.getSubmittedCategories();
			underReviewCategories = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

{#if $currentUser && $currentUser.role === ROLES.ADMIN}
	<h1 class="text-4xl font-semibold my-4 text-center">Uždavinių peržiūra</h1>
	{#if loading}
		<p class="text-center">Kraunasi...</p>
	{/if}
	{#if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{/if}
	<Accordion class="mt-8">
		{#each underReviewCategories as category}
			<CategoryToReview {category} {operationDone} />
		{/each}
		{#if underReviewCategories.length === 0}
			<p class="text-center">Nėra kategorijų peržiūrai</p>
		{/if}
	</Accordion>
{:else}
	<p>Unauthorized</p>
{/if}
