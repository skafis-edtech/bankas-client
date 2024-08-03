<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FindById from '$components/layout/FindById.svelte';
	import type { Category } from '$services/gen-client';
	import CategoryWithProblems from '$components/layout/CategoryWithProblems.svelte';
	import type { AuthContext } from '../types';
	import { publicApi } from '$services/apiService';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { Button, Search } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const { user } = getContext('authContext') as AuthContext;
	const searchUrlStr: string = $page.url.searchParams.get('search') || '';

	let searchValue = '';
	$: searchValue = searchUrlStr;

	page.subscribe(($page) => {
		const searchUrlStr: string = $page.url.searchParams.get('search') || '';
		searchValue = searchUrlStr;
	});

	let categories: Category[] = [];
	let numOfProblems: number | null = null;
	let numOfCategories: number | null = null;

	onMount(async () => {
		const [categoriesRes, problemsCountRes, categoriesCountRes] = await Promise.all([
			publicApi.getCategories(),
			publicApi.getProblemsCount(),
			publicApi.getCategoriesCount()
		]);

		categories = categoriesRes.data;
		numOfProblems = problemsCountRes.data.count;
		numOfCategories = categoriesCountRes.data.count;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>

<h5 class="text-md font-semibold my-4 text-center">
	Mokytojų pasidalintos originalios bei kitos viešos užduotys surūšiuotos į temas (kategorijas).
</h5>

<h4 class="text-md font-semibold my-4 text-center">
	Užduočių: {numOfProblems || '...'} | Kategorijų: {numOfCategories || '...'}
</h4>
<Button
	color="alternative"
	on:click={() => {
		goto('/snipping-tool');
	}}>Karpymo įrankis</Button
>

<HorizontalLine />

<FindById />

<HorizontalLine />

<div class="text-center">
	<h1 class="text-2xl font-semibold my-3">Kategorijos</h1>
	{#if !$user}
		<p>
			Norite įkelti savo užduotis ar patvirtinti pateiktas kitų? <a
				class="text-blue-800 underline"
				href="/register">Registruokitės!</a
			>
		</p>
	{/if}
</div>

<Search class="my-3" placeholder="Ieškoti" bind:value={searchValue} />

{#each Object.entries(categories) as [id, category]}
	{#if category.name.toLowerCase().includes(searchValue.toLowerCase())}
		<CategoryWithProblems {category} {searchValue} />
	{/if}
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
