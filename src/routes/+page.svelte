<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCategories, type Category } from '$services/dataService';
	import FindById from '$components/layout/FindById.svelte';
	import { Accordion } from 'flowbite-svelte';
	import CategoryComponent from '$components/layout/CategoryComponent.svelte';

	let loading: boolean = true;
	let error: string | null = null;

	let categories: Category[] = [];

	onMount(async () => {
		try {
			categories = await fetchCategories();
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>

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
