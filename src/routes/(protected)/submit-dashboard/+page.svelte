<script lang="ts">
	import { onMount } from 'svelte';
	import {
		UnderReviewProblemReviewStatusEnum,
		type Category,
		type UnderReviewCategory
	} from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import { currentUser } from '$lib/stores';
	import { Accordion, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import CategorySubmitted from '$components/ui/CategorySubmitted.svelte';

	let loading = true;
	let error = '';

	let myUnderReviewCategories: UnderReviewCategory[] = [];
	let allPublicCategories: Category[] = [];

	onMount(async () => {
		try {
			const response = await categoryApi.getAllPublicCategories();
			allPublicCategories = response.data;
		} catch (e: any) {
			error = e.message;
		}
		try {
			const response = await categoryApi.getMyUnderReviewCategories();
			myUnderReviewCategories = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Uždavinių pateikimas</h1>
	{#if loading}
		<p class="text-center">Kraunasi...</p>
	{/if}
	{#if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{/if}
	<Accordion class="mt-8">
		{#each myUnderReviewCategories as category}
			<CategorySubmitted {category} />
		{/each}
		<div class="flex flex-row justify-center">
			<Button color="green" on:click={() => goto('/submit-new-category')}
				>Kurti naują kategoriją</Button
			>
		</div>
		<div class="my-8">
			<hr class="border-y-2 border-black" />
		</div>
		{#each allPublicCategories as category}
			<CategorySubmitted {category} />
		{/each}
	</Accordion>
{:else}
	<p>Unauthorized</p>
{/if}
