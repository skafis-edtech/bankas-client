<script lang="ts">
	import { successStore } from '$lib/stores';
	import { sortApi } from '$services/apiService';
	import type { Category } from '$services/gen-client';
	import { Button, Checkbox } from 'flowbite-svelte';

	export let categories: Category[] = [];
	export let currentProblemId: string;
	export let currentProblemCategories: string[] = [];
	export let skipProblem: () => void;

	let selectedCategories: string[] = [];
	let isConfirmNeeded: boolean = false;

	$: {
		selectedCategories = currentProblemCategories;
	}

	$: {
		isConfirmNeeded = currentProblemCategories.length > 0 || selectedCategories.length > 0;
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
	<Button size="sm" color="yellow" on:click={skipProblem}>PRALEISTI</Button>
	{#if isConfirmNeeded}
		<Button size="sm" color="red" on:click={sortProblem}>ĮRAŠYTI</Button>
	{/if}
	{#each categories as category}
		<Button
			size="sm"
			color={selectedCategories.includes(category.id) ? 'blue' : 'light'}
			on:click={() => {
				if (isConfirmNeeded) {
					alert(
						'Yra pažymėtų kategorijų, dabar naudokitės žymėjimo langeliais ir mygtuku "ĮRAŠYTI"'
					);
				} else {
					selectedCategories = [category.id];
					sortProblem();
				}
			}}
			>{category.name}<Checkbox
				on:click={(event) => {
					event.stopPropagation();
					toggleCategory(category.id);
				}}
				checked={selectedCategories.includes(category.id)}
				class="h-6 w-6"
			/>
		</Button>
	{/each}

	<p class="text-white w-fit">
		Nerandate tinkamos kategorijos? Susisiekite el. paštu naglis.suliokas@gmail.com
	</p>
</div>
