<script lang="ts">
	import type { Category } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import CategoryWithProblems from './CategoryWithProblems.svelte';

	let categories: Category[] = [];
	export let searchValue = '';
	let page = 0;
	let size = 8;
	let timer: NodeJS.Timeout;

	$: if (searchValue !== null) {
		if (timer) {
			clearTimeout(timer);
		}

		// Call API after 1 second of no input changes
		timer = setTimeout(async () => {
			page = 0; // Reset to first page on new search
			await fetchCategories();
		}, 1000);
	}

	async function fetchCategories() {
		const categoriesRes = await viewApi.getCategories(page, size, searchValue);
		categories = categoriesRes.data;
	}

	async function changePage(direction: number) {
		page += direction;
		if (page < 0) {
			page = 0;
		}
		await fetchCategories();
	}

	onMount(async () => {
		await fetchCategories();
	});
</script>

<Search class="my-3" placeholder="Ieškoti" bind:value={searchValue} />

{#each Object.entries(categories) as [id, category]}
	<CategoryWithProblems {category} {searchValue} />
{/each}

{#if 'Nesurūšiuota'.toLowerCase().includes(searchValue.toLowerCase())}
	<CategoryWithProblems
		category={{
			id: '',
			name: 'Nesurūšiuota',
			description: 'Užduotys, kurios yra patvirtintos, tačiau dar nepriskirtos jokiai kategorijai.'
		}}
		{searchValue}
	/>
{/if}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️ Ankstesnis</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>Sekantis ➡️</Button>
</div>
