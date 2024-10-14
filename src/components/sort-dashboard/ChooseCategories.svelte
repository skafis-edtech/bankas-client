<script lang="ts">
	import { successStore } from '$lib/stores';
	import { sortApi } from '$services/apiService';
	import type { Category } from '$services/gen-client';
	import { Button, Checkbox, Popover } from 'flowbite-svelte';
	import { Search } from 'flowbite-svelte';
	import DraggableDiv from './DraggableDiv.svelte';
	import MarkdownDisplay from '../MarkdownDisplay.svelte';

	export let categories: Category[] = [];
	export let currentProblemId: string;
	export let currentProblemCategories: string[] = [];
	export let skipProblem: () => void;

	let selectedCategories: string[] = [];
	let isConfirmNeeded: boolean = false;
	let filterValue = 'BUP. Matematika. ';
	let hoveredCategoryId: string = '';
	let hoverTimeout: NodeJS.Timeout | null = null;
	let isShowPopover = false;

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

	function handleMouseEnter(categoryId: string) {
		hoveredCategoryId = categoryId;
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		hoverTimeout = setTimeout(() => {
			console.log('show popover');
			isShowPopover = true;
		}, 1000);
	}

	function handleMouseLeave() {
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		hoveredCategoryId = '';
		isShowPopover = false;
	}
</script>

<div role="banner" on:mouseleave={handleMouseLeave}>
	<DraggableDiv>
		<div class="flex flex-col items-end gap-2">
			<Button size="sm" color="yellow" class="max-w-96" on:click={skipProblem}>PRALEISTI</Button>
			<div class="min-h-8">
				{#if isConfirmNeeded}
					<Button size="sm" color="red" class="max-w-96 w-64" on:click={sortProblem}>ĮRAŠYTI</Button
					>
				{:else}
					<p class="text-white text-xs">
						Paspaudus mygtuką priskiriama viena kategorija. Rinkitės daugiau kategorijų naudodamiesi
						žymėjimo langeliais
					</p>
				{/if}
			</div>
			<div>
				<Search class="my-3 py-0 max-w-96" placeholder="Filtras" bind:value={filterValue} />
			</div>
		</div>

		<div class="flex gap-4 flex-row flex-wrap">
			{#each categories.filter((category) => category.name.includes(filterValue)) as category}
				<Button
					class="min-w-80"
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
					on:mouseenter={() => handleMouseEnter(category.id)}
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
	</DraggableDiv>
	<Popover
		params={{ duration: 1000 }}
		title={categories.find((category) => category.id === hoveredCategoryId)?.name}
		placement="right"
		class="z-10 w-[18%] "
		open={isShowPopover}
	>
		<div class="overflow-scroll max-h-screen">
			<MarkdownDisplay
				value={categories.find((category) => category.id === hoveredCategoryId)?.description}
			/>
		</div>
	</Popover>
</div>
