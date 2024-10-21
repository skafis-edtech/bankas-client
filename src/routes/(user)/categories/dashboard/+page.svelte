<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FindById from '$components/layout/FindById.svelte';
	import CategoryListPageable from '$components/lists/CategoryListPageable.svelte';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { Button } from 'flowbite-svelte';

	const searchUrlStr: string = $page.url.searchParams.get('search') || '';

	let searchValue = '';
	$: searchValue = searchUrlStr;

	page.subscribe(($page) => {
		const searchSourcesUrlStr: string = $page.url.searchParams.get('search') || '';
		searchValue = searchSourcesUrlStr;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduotys pagal kategorijas</h1>
<div class="w-full">
	<p>Later here you can select/deselect sources</p>
	<p>Not functioning much yet</p>
</div>
<Button color="green" on:click={() => goto('/categories/new-category')} class="w-full my-4"
	>Pridėti privačią kategoriją</Button
>

<CategoryListPageable {searchValue} />

<HorizontalLine />

<FindById />
