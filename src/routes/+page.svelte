<script lang="ts">
	import { onMount } from 'svelte';
	import FindById from '$components/layout/FindById.svelte';
	import { Accordion, Badge } from 'flowbite-svelte';
	import CategoryComponent from '$components/layout/CategoryComponent.svelte';
	import type { Category } from '$services/gen-client';
	import { categoryApi, problemApi } from '$services/apiService';

	let loading: boolean = true;
	let error: string | null = null;

	let categories: Category[] = [];

	let numOfProblems: number | null = null;
	let numOfCategories: number | null = null;

	onMount(async () => {
		try {
			const response = await categoryApi.getAllPublicCategories();
			categories = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
		try {
			const response = await problemApi.getPublicProblemsCount();
			numOfProblems = response.data.count;
		} catch (e: any) {
			error = e.message;
		}
		try {
			const response = await categoryApi.getPublicCategoriesCount();
			numOfCategories = response.data.count;
		} catch (e: any) {
			error = e.message;
		}
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>
<Badge color="red" class="flex justify-center"
	>DĖMESIO! Dabartinė šio tinklapio versija nėra stabili bei nėra išbaigta! Nekelkite ilgalaikių
	duomenų</Badge
>

<h3 class="text-xl font-semibold my-4 text-center">Užduočių: {numOfProblems || 'Kraunasi...'}</h3>
<h3 class="text-xl font-semibold my-4 text-center">
	Kategorijų: {numOfCategories || 'Kraunasi...'}
</h3>

<FindById />

<div class="text-center">
	<h1 class="text-2xl font-semibold mb-4">Kategorijos</h1>
	<p>
		Norite įkelti savo užduotis ar patvirtinti pateiktas kitų? <a
			class="text-blue-800 underline"
			href="/register">Registruokitės!</a
		>
	</p>
</div>

<Accordion>
	{#if loading}
		<p class="text-center">Kraunasi...</p>
	{:else if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{:else}
		{#each Object.entries(categories) as [id, category]}
			<CategoryComponent {category} />
		{/each}
	{/if}
</Accordion>
