<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FindById from '$components/layout/FindById.svelte';
	import CategoryListPageable from '$components/lists/CategoryListPageable.svelte';
	import { Button, Accordion, AccordionItem, Modal } from 'flowbite-svelte';
	import type { RandomContext } from '../../../../types';
	import { setContext } from 'svelte';
	import SourceNamesPageable from '$components/lists/SourceNamesPageable.svelte';
	import { SourceFilterOptionEnum } from '../../../../enums';

	const searchUrlStr: string = $page.url.searchParams.get('search') || '';

	let searchValue = '';
	let seed = new Date().setHours(0, 0, 0, 0) / 10000000;
	let selectedFilter: SourceFilterOptionEnum = SourceFilterOptionEnum.EXCEPT;
	let selectedSourceIds: string[] = [];
	let showModal = false;

	$: searchValue = searchUrlStr;

	page.subscribe(($page) => {
		const searchSourcesUrlStr: string = $page.url.searchParams.get('search') || '';
		searchValue = searchSourcesUrlStr;
	});

	setContext<RandomContext>('randomContext', { seed });
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduotys pagal kategorijas</h1>
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
	<div class="flex flex-col items-end">
		<input id="seed" type="number" bind:value={seed} class="border rounded p-2 text-sm w-24" />
		<label for="seed" class="text-xs">Atsitiktinio rinkinio numeris (atsinaujina kasdien)</label>
	</div>
</div>

<Button color="green" on:click={() => goto('/categories/new-category')} class="w-full my-4">
	Pridėti kategoriją
</Button>

<Accordion>
	<AccordionItem activeClass="h-10" inactiveClass="h-10">
		<span slot="header" class="text-lg text-center w-full">Šaltinių filtras</span>
		<div class="flex flex-col">
			<label>
				<input
					type="radio"
					name="filter"
					value={SourceFilterOptionEnum.EXCEPT}
					bind:group={selectedFilter}
				/>
				Rodyti visus šaltinius, išskyrus:
			</label>
			<label>
				<input
					type="radio"
					name="filter"
					value={SourceFilterOptionEnum.ONLY}
					bind:group={selectedFilter}
				/>
				Rodyti tik šiuos šaltinius:
			</label>
			<label>
				<input
					type="radio"
					name="filter"
					value={SourceFilterOptionEnum.IGNORE}
					bind:group={selectedFilter}
				/>
				Išjungti šaltinių filtrą
			</label>
		</div>
		<SourceNamesPageable bind:selectedSourceIds />
	</AccordionItem>
</Accordion>

<CategoryListPageable {searchValue} sourceIds={selectedSourceIds} filterOption={selectedFilter} />
