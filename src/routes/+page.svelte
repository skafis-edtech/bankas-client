<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FindById from '$components/layout/home/FindById.svelte';
	import type { SourceDisplayDto } from '$services/gen-client';
	import type { AuthContext } from '../types';
	import { publicApi } from '$services/apiService';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CategoryListPageable from '$components/layout/lists/CategoryListPageable.svelte';
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';

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

	let sources: SourceDisplayDto[] = [];
	let numOfProblems: number | null = null;
	let sourcesLoaded = false;

	onMount(async () => {
		const problemsCountRes = await publicApi.getProblemsCount();
		numOfProblems = problemsCountRes.data.count;

		if (tab === 'sources' || !tab) {
			await loadSources();
		}
	});

	async function loadSources() {
		if (sourcesLoaded) return;
		const sourcesRes = await publicApi.getApprovedSources();
		sources = sourcesRes.data;
		sourcesLoaded = true;
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>

<h5 class="text-md font-semibold my-4 text-center">
	Mokytojų pasidalintos originalios matematikos užduotys, surūšiuotos į temas (kategorijas). Plačiau
	puslapyje <a class="text-blue-800 underline" href="/about">"Apie"</a>
</h5>

<h4 class="text-md font-semibold my-4 text-center">
	Užduočių: {numOfProblems || '...'}
</h4>
<div class="flex flex-row justify-between">
	<Button
		color="alternative"
		on:click={() => {
			goto('/snipping-tool');
		}}>Karpymo įrankis</Button
	>
	<Button
		color="blue"
		on:click={() => {
			goto('/list');
		}}>Atrinktų sąrašas</Button
	>
</div>

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

		<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="approved" />
	</TabItem>
	<TabItem open={tab === 'categories'} title="Kategorijos">
		<div class="text-center">
			<h1 class="text-2xl font-semibold my-3">Kategorijos</h1>
			<p>Šiuo metu kategorijos dar kuriamos ...</p>
		</div>
		{#if $user}
			<CategoryListPageable searchValue={searchCategoriesValue} />
		{/if}
	</TabItem>
</Tabs>
