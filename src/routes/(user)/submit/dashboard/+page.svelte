<script lang="ts">
	import { goto } from '$app/navigation';
	import SourceListPeageable from '$components/lists/SourceListPeageable.svelte';
	import { GetSourcesByAuthorSortByEnum } from '$services/gen-client';
	import { Button, ButtonGroup } from 'flowbite-svelte';

	let searchSourcesValue = '';
	let sortBy: GetSourcesByAuthorSortByEnum = GetSourcesByAuthorSortByEnum.Newest;
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
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.MostProblems ? 'red' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.MostProblems)}
			>Daugiausiai užduočių</Button
		>
		<Button
			class="flex-1"
			color={sortBy === GetSourcesByAuthorSortByEnum.LeastProblems ? 'green' : 'alternative'}
			on:click={() => (sortBy = GetSourcesByAuthorSortByEnum.LeastProblems)}
			>Mažiausiai užduočių</Button
		>
	</ButtonGroup>
</div>
<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="mine" />
