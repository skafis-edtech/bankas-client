<script lang="ts">
	import { CategoryVisibilityEnum, type CategoryDisplayDto } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import CategoryWithProblems from './CategoryWithProblems.svelte';
	import { categoryViewApi } from '$services/apiService';
	import { CategoryDisplayEnum, SourceFilterOptionEnum } from '../../enums';
	import type { AuthContext } from '../../types';
	import { ROLES } from '$utils/constants';

	let categories: CategoryDisplayDto[] = [];
	export let searchValue = '';
	export let sourceIds: string[] = [];
	export let filterOption: SourceFilterOptionEnum = SourceFilterOptionEnum.IGNORE;
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
			history.replaceState(null, '', `?search=${searchValue}`);
		}, 1000);
	}

	$: if (sourceIds || filterOption) {
		console.log('sourceIds', sourceIds, 'filterOption', filterOption);

		page = 0;
		fetchCategories();
	}

	async function fetchCategories() {
		if (filterOption === SourceFilterOptionEnum.IGNORE) {
			const categoriesRes = await categoryViewApi.getCategories(
				page,
				size,
				searchValue,
				undefined,
				undefined
			);
			categories = categoriesRes.data;
		} else if (filterOption === SourceFilterOptionEnum.EXCEPT) {
			const categoriesRes = await categoryViewApi.getCategories(
				page,
				size,
				searchValue,
				sourceIds,
				undefined
			);
			categories = categoriesRes.data;
		} else if (filterOption === SourceFilterOptionEnum.ONLY) {
			const categoriesRes = await categoryViewApi.getCategories(
				page,
				size,
				searchValue,
				undefined,
				sourceIds
			);
			categories = categoriesRes.data;
		} else {
			throw new Error('Unknown filter option');
		}
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

	const { user } = getContext('authContext') as AuthContext;
</script>

<Search
	class="my-3"
	placeholder="Ieškoti pagal pavadinimą arba aprašymą..."
	bind:value={searchValue}
/>

{#each Object.entries(categories) as [id, category]}
	{#if category.visibility === CategoryVisibilityEnum.Private}
		<CategoryWithProblems
			category={{ ...category, name: '🔒 ' + category.name }}
			{searchValue}
			displayType={CategoryDisplayEnum.MANAGE}
			{sourceIds}
			{filterOption}
		/>
	{:else if $user.role === ROLES.SUPER_ADMIN}
		<CategoryWithProblems
			category={{ ...category, name: '🌐 ' + category.name }}
			{searchValue}
			displayType={CategoryDisplayEnum.MANAGE}
			{sourceIds}
			{filterOption}
		/>
	{:else}
		<CategoryWithProblems
			category={{ ...category, name: '🌐 ' + category.name }}
			{searchValue}
			displayType={CategoryDisplayEnum.DISPLAY}
			{sourceIds}
			{filterOption}
		/>
	{/if}
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️ Ankstesnis</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>Sekantis ➡️</Button>
</div>
