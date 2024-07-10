<script lang="ts">
	import CategoryForReview from '$components/ui/CategoryForReview.svelte';
	import { onMount } from 'svelte';
	import type { Category, UnderReviewCategory } from '$services/gen-client';
	import { writable } from 'svelte/store';
	import { categoryApi, categoryOldApi } from '$services/apiService';

	let loading = true;
	let error = '';

	let underReviewCategories: UnderReviewCategory[] = [];
	let publicCategories: Category[] = [];

	let operationDone = writable(false);

	onMount(async () => {
		try {
			const response = await categoryOldApi.getSubmittedCategories();
			underReviewCategories = response.data;
		} catch (e: any) {
			error = e.message;
		}
		try {
			const response = await categoryOldApi.getAllPublicCategories();
			publicCategories = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>
{#if loading}
	<p class="text-center">Kraunasi...</p>
{/if}
{#if error}
	<p class="text-red-600 text-center">Klaida: {error}</p>
{/if}
{#each underReviewCategories as category}
	<CategoryForReview {category} {operationDone} />
{/each}
{#each publicCategories as category}
	<CategoryForReview {category} {operationDone} />
{/each}
