<script lang="ts">
	import { onMount } from 'svelte';
	import {
		fetchCategories,
		fetchNumOfCategories,
		fetchNumOfProblems,
		type CategoryForDatabase as Category
	} from '$services/dataService';
	import FindById from '$components/layout/FindById.svelte';
	import { Accordion } from 'flowbite-svelte';
	import CategoryComponent from '$components/layout/CategoryComponent.svelte';

	let loading: boolean = true;
	let error: string | null = null;

	let categories: Category[] = [];

	let numOfProblems: number | null = null;
	let numOfCategories: number | null = null;

	onMount(async () => {
		try {
			categories = await fetchCategories();
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}

		try {
			numOfProblems = await fetchNumOfProblems();
		} catch (e: any) {
			error = e.message;
		}

		try {
			numOfCategories = await fetchNumOfCategories();
		} catch (e: any) {
			error = e.message;
		}
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>
<h3 class="text-xl font-semibold my-4 text-center">Užduočių: {numOfProblems || 'Loading...'}</h3>
<h3 class="text-xl font-semibold my-4 text-center">
	Kategorijų: {numOfCategories || 'Loading...'}
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
		<p>Loading...</p>
	{:else if error}
		<p>Error: {error}</p>
	{:else}
		{#each Object.entries(categories) as [id, category]}
			<CategoryComponent {category} />
		{/each}
	{/if}
</Accordion>
