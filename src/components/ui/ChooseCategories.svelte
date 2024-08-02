<script lang="ts">
	import { successStore } from '$lib/stores';
	import { sortApi } from '$services/apiService';
	import type { Category } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';

	export let categories: Category[] = [];
	export let currentProblemId: string;
	export let currentProblemCategories: string[] = [];
	export let skipProblem: () => void;

	let selectedCategories: string[] = [];

	$: {
		selectedCategories = currentProblemCategories;
	}

	function toggleCategory(categoryId: string) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter((id) => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}
	}

	async function sortProblem() {
		await sortApi.sortProblem(currentProblemId, { categories: selectedCategories });
		successStore.set('Užduotis sėkmingai surūšiuota');
		skipProblem();
	}
</script>

<div
	class="flex fixed top-16 left-0 w-72 z-10 gap-4 flex-wrap bg-black p-4 rounded-md overflow-scroll h-[calc(100%-4rem)]"
>
	{#each categories as category}
		<Button
			size="sm"
			color={selectedCategories.includes(category.id) ? 'blue' : 'light'}
			on:click={() => toggleCategory(category.id)}
			>{category.name}
		</Button>
	{/each}
	{#if currentProblemCategories === selectedCategories}
		<Button size="sm" color="red" on:click={skipProblem}>PRALEISTI</Button>
	{:else}
		<Button size="sm" color="red" on:click={sortProblem}>ĮRAŠYTI</Button>
	{/if}
	<p class="text-white w-fit">
		Nerandate tinkamos kategorijos? Susisiekite el. paštu naglis.suliokas@gmail.com
	</p>
</div>
