<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FindById from '$components/layout/FindById.svelte';
	import type { Category, SourceDisplayDto } from '$services/gen-client';
	import CategoryWithProblems from '$components/layout/CategoryWithProblems.svelte';
	import type { AuthContext } from '../types';
	import { approvalApi, publicApi } from '$services/apiService';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { Button, Search, TabItem, Tabs } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SourceWithProblems from '$components/layout/SourceWithProblems.svelte';

	const { user } = getContext('authContext') as AuthContext;

	const tab = $page.url.hash.slice(1);
	const searchCategoriesUrlStr: string = $page.url.searchParams.get('searchCategories') || '';
	const searchSourcesUrlStr: string = $page.url.searchParams.get('searchSources') || '';

	let searchCategoriesValue = '';
	let searchSourcesValue = '';
	$: searchCategoriesValue = searchCategoriesUrlStr;
	$: searchSourcesValue = searchSourcesUrlStr;

	page.subscribe(($page) => {
		const searchCategoriesUrlStr: string = $page.url.searchParams.get('searchCategories') || '';
		searchCategoriesValue = searchCategoriesUrlStr;
		const searchSourcesUrlStr: string = $page.url.searchParams.get('searchSources') || '';
		searchSourcesValue = searchSourcesUrlStr;
	});

	let categories: Category[] = [];
	let sources: SourceDisplayDto[] = [];
	let numOfProblems: number | null = null;

	onMount(async () => {
		const problemsCountRes = await publicApi.getProblemsCount();
		numOfProblems = problemsCountRes.data.count;

		if (tab === 'sources' || !tab) {
			await loadSources();
		} else if (tab === 'categories') {
			await loadCategories();
		}
	});

	async function loadCategories() {
		const categoriesRes = await publicApi.getCategories();
		categories = categoriesRes.data;
	}

	async function loadSources() {
		const sourcesRes = await publicApi.getApprovedSources();
		sources = sourcesRes.data;
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>

<h5 class="text-md font-semibold my-4 text-center">
	Mokytojų pasidalintos originalios užduotys surūšiuotos į temas (kategorijas). Plačiau puslapyje <a
		class="text-blue-800 underline"
		href="/about">"Apie"</a
	>
</h5>

<h4 class="text-md font-semibold my-4 text-center">
	Užduočių: {numOfProblems || '...'}
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

<Tabs>
	<TabItem open={tab === 'sources' || !tab} title="Šaltiniai" on:click={loadSources}>
		<div class="text-center">
			<h1 class="text-2xl font-semibold my-3">Šaltiniai</h1>
			{#if !$user}
				<p>
					Norite įkelti savo užduotis ar patvirtinti pateiktas kitų? <a
						class="text-blue-800 underline"
						href="/register">Registruokitės!</a
					>
				</p>
			{/if}
		</div>

		<Search class="my-3" placeholder="Ieškoti" bind:value={searchSourcesValue} />

		{#each Object.entries(sources) as [id, source]}
			{#if source.name.toLowerCase().includes(searchSourcesValue.toLowerCase())}
				<SourceWithProblems {source} searchValue={searchSourcesValue} />
			{/if}
		{/each}
	</TabItem>
	<TabItem open={tab === 'categories'} title="Kategorijos" on:click={loadCategories}>
		<div class="text-center">
			<h1 class="text-2xl font-semibold my-3">Kategorijos</h1>
			<p>Šiuo metu kategorijos dar kuriamos ...</p>
		</div>
		{#if $user}
			<Search class="my-3" placeholder="Ieškoti" bind:value={searchCategoriesValue} />

			{#each Object.entries(categories) as [id, category]}
				{#if category.name.toLowerCase().includes(searchCategoriesValue.toLowerCase())}
					<CategoryWithProblems {category} searchValue={searchCategoriesValue} />
				{/if}
			{/each}
			{#if 'Nesurūšiuota'.toLowerCase().includes(searchCategoriesValue.toLowerCase())}
				<CategoryWithProblems
					category={{
						id: '',
						name: 'Nesurūšiuota',
						description:
							'Užduotys, kurios yra patvirtintos, tačiau dar nepriskirtos jokiai kategorijai.'
					}}
					searchValue={searchCategoriesValue}
				/>
			{/if}
		{/if}
	</TabItem>
</Tabs>
