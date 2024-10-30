<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FindById from '$components/layout/FindById.svelte';
	import SourceListPeageable from '$components/lists/SourceListPeageable.svelte';
	import { GetSourcesByAuthorSortByEnum } from '$services/gen-client';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { SourceSubsetEnum } from '../../../../enums';
	import { Modal } from 'flowbite-svelte';

	let sortBy: GetSourcesByAuthorSortByEnum = GetSourcesByAuthorSortByEnum.Newest;
	let showModal = false;

	const searchUrlStr: string = $page.url.searchParams.get('search') || '';

	let searchValue = '';
	$: searchValue = searchUrlStr;

	page.subscribe(($page) => {
		const searchSourcesUrlStr: string = $page.url.searchParams.get('search') || '';
		searchValue = searchSourcesUrlStr;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduotys pagal šaltinius</h1>
<div class="flex justify-between h-10">
	<Button on:click={() => (showModal = true)}>Pagal SKF kodą (kopijavimui)</Button>
	<Modal
		size="lg"
		classBody="bg-[beige] rounded-md"
		open={showModal}
		on:close={() => (showModal = false)}
	>
		<FindById />
	</Modal>
	<Button on:click={() => alert('Norėdami turinį eksportuoti, kreipkitės el. paštu info@skafis.lt')}
		>Eksportas</Button
	>
</div>
<Button color="green" on:click={() => goto('/sources/new-source')} class="w-full my-4"
	>Pridėti šaltinį (užduočių rinkinį)</Button
>
<div class="w-full h-10">
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

<SourceListPeageable bind:searchValue {sortBy} sourcesSubset={SourceSubsetEnum.AVAILABLE} />
