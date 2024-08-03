<script lang="ts">
	import { successStore } from '$lib/stores';
	import { sortApi } from '$services/apiService';
	import type { Category } from '$services/gen-client';
	import { Button, Checkbox } from 'flowbite-svelte';
	import { Search } from 'flowbite-svelte';

	export let categories: Category[] = [];
	export let currentProblemId: string;
	export let currentProblemCategories: string[] = [];
	export let skipProblem: () => void;

	let selectedCategories: string[] = [];
	let isConfirmNeeded: boolean = false;
	let filterValue = 'BUP. Matematika. 11 kl.';

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
	class="flex flex-col fixed top-16 left-0 w-80 z-10 gap-4 bg-black p-4 rounded-md overflow-scroll h-[calc(100%-4rem)]"
>
	<Button size="sm" color="yellow" on:click={skipProblem}>PRALEISTI</Button>
	{#if isConfirmNeeded}
		<Button size="sm" color="red" on:click={sortProblem}>ĮRAŠYTI</Button>
	{:else}
		<div class="text-white text-xs">
			Paspaudus mygtuką priskiriama viena kategorija. Rinkitės daugiau kategorijų naudodamiesi
			žymėjimo langeliais
		</div>
	{/if}
	<Search class="my-3 py-0" placeholder="Filtras" bind:value={filterValue} />
	<div class="flex flex-col gap-4">
		{#each categories.filter((category) => category.name.includes(filterValue)) as category}
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
			>
				{category.name.replace(filterValue, '')}
				<Checkbox
					on:click={(event) => {
						event.stopPropagation();
						toggleCategory(category.id);
					}}
					checked={selectedCategories.includes(category.id)}
					class="h-8 w-8"
				/>
			</Button>
		{/each}
	</div>
	<p class="text-white w-fit">
		Nerandate tinkamos kategorijos? Susisiekite el. paštu naglis.suliokas@gmail.com
	</p>
</div>
