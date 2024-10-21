<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FindById from '$components/layout/FindById.svelte';
	import SourceListPeageable from '$components/lists/SourceListPeageable.svelte';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { GetSourcesByAuthorSortByEnum } from '$services/gen-client';
	import { Button, ButtonGroup, Tabs, TabItem } from 'flowbite-svelte';
	import { SourceSubsetEnum } from '../../../../types';

	let sortBy: GetSourcesByAuthorSortByEnum = GetSourcesByAuthorSortByEnum.Newest;

	const tab = $page.url.hash.slice(1);
	const loadSources = () => alert('Not implemented yet');

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
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Mano užduotys</h1>
<h3 class="my-4">Norėdami turinį eksportuoti, kreipkitės el. paštu.</h3>
<Button color="green" on:click={() => goto('/submit/new-source')} class="w-full my-4"
	>Pridėti šaltinį (užduočių rinkinį)</Button
>
<div class="w-full">
	<ButtonGroup class="w-full flex flex-wrap">
		<Button
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.Newest ? 'blue' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.Newest)}>Naujausi</Button
		>
		<Button
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.Oldest ? 'primary' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.Oldest)}>Seniausi</Button
		>
		<Button
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.NameAsc ? 'purple' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.NameAsc)}>A-Z</Button
		>
		<Button
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.NameDesc ? 'yellow' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.NameDesc)}>Z-A</Button
		>
		<Button
			disabled
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.MostProblems ? 'red' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.MostProblems)}
			>Daugiausiai užduočių</Button
		>
		<Button
			disabled
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.LeastProblems ? 'green' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.LeastProblems)}
			>Mažiausiai užduočių</Button
		>
	</ButtonGroup>
</div>

<Tabs>
	<TabItem open={tab === 'sources' || !tab} title="Šaltiniai" on:click={loadSources}>
		<div class="text-center">
			<h1 class="text-2xl font-semibold my-3">Šaltiniai</h1>
		</div>

		<SourceListPeageable
			searchValue={searchSourcesValue}
			{sortBy}
			sourcesSubset={SourceSubsetEnum.AVAILABLE}
		/>
	</TabItem>
	<TabItem open={tab === 'categories'} title="Kategorijos">
		<div class="text-center">
			<h1 class="text-2xl font-semibold my-3">Kategorijos</h1>
		</div>
	</TabItem>
</Tabs>

<HorizontalLine />

<FindById />
