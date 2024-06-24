<script lang="ts">
	import { onMount } from 'svelte';
	import {
		UnderReviewProblemReviewStatusEnum,
		type Category,
		type UnderReviewCategory
	} from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import SubmitPageCategory from '$components/layout/SubmitPageCategory.svelte';
	import { currentUser } from '$lib/stores';
	import { Accordion, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

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

<h1 class="text-4xl font-semibold my-4 text-center">Uždavinių pateikimas</h1>
{#if loading}
	<p class="text-center">Kraunasi...</p>
{/if}
{#if error}
	<p class="text-red-600 text-center">Klaida: {error}</p>
{/if}
<Accordion class="mt-8">
	{#each myUnderReviewCategories as category}
		<SubmitPageCategory
			{category}
			isPending={category.reviewStatus === UnderReviewProblemReviewStatusEnum.Pending}
			isRejected={category.reviewStatus === UnderReviewProblemReviewStatusEnum.Rejected}
			isOwnedByUser={true}
		/>
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
		<SubmitPageCategory {category} isOwnedByUser={category.author === $currentUser?.username} />
	{/each}
</Accordion>
