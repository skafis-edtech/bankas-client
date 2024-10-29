<script lang="ts">
	import { GetSourcesByAuthorSortByEnum, type SourceDisplayDto } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import { reviewApi, sourceViewApi } from '$services/apiService';
	import { SourceSubsetEnum } from '../../enums';
	import type { AuthContext } from '../../types';

	let sources: SourceDisplayDto[] = [];
	export let selectedSourceIds: string[] = [];

	export let searchValue = '';
	export let sourcesSubset: SourceSubsetEnum = SourceSubsetEnum.AVAILABLE;
	export let author: string = '';
	export let sortBy: GetSourcesByAuthorSortByEnum = GetSourcesByAuthorSortByEnum.Newest;
	let page = 0;
	let size = 8;
	let timer: NodeJS.Timeout;

	const { user } = getContext('authContext') as AuthContext;

	$: (async () => {
		if (sortBy) {
			await fetchSources();
		}
	})();

	$: if (searchValue !== null) {
		if (timer) {
			clearTimeout(timer);
		}

		// Call API after 1 second of no input changes
		timer = setTimeout(async () => {
			page = 0; // Reset to first page on new search
			await fetchSources();
		}, 1000);
	}

	async function fetchSources() {
		if (sourcesSubset === SourceSubsetEnum.AVAILABLE) {
			const response = await sourceViewApi.getAvailableSources(page, size, searchValue, sortBy);
			sources = response.data;
		} else if (sourcesSubset === SourceSubsetEnum.PENDING) {
			const sourcesRes = await reviewApi.getPendingSources(page, size, searchValue);
			sources = sourcesRes.data;
		} else if (sourcesSubset === SourceSubsetEnum.AUTHOR) {
			if (!author) {
				console.error('Author not provided');
				return;
			}
			const sourcesRes = await sourceViewApi.getSourcesByAuthor(
				author,
				page,
				size,
				searchValue,
				sortBy
			);
			sources = sourcesRes.data;
		} else {
			console.error('Invalid sources subset');
		}
	}

	async function changePage(direction: number) {
		page += direction;
		if (page < 0) {
			page = 0;
		}
		await fetchSources();
	}

	onMount(async () => {
		await fetchSources();
	});

	function removeSource(id: string) {
		//sources = sources.filter((source) => source.id !== id);
	}

	function toggleSelection(id: string) {
		if (selectedSourceIds.includes(id)) {
			selectedSourceIds = selectedSourceIds.filter((item) => item !== id);
		} else {
			selectedSourceIds = [...selectedSourceIds, id];
		}
	}
</script>

<Search
	class="my-3"
	placeholder="Ieškoti pagal pavadinimą ir aprašymą..."
	bind:value={searchValue}
/>

{#each Object.entries(sources) as [id, source]}
	<div class="relative">
		{#if sourcesSubset === SourceSubsetEnum.AVAILABLE}
			<label>
				<input
					type="checkbox"
					checked={selectedSourceIds.includes(source.id)}
					on:change={() => toggleSelection(source.id)}
				/>
				{source.name} ({source.authorUsername})
			</label>
		{:else}
			<h1>Klaida: susisiekite su administratoriumi</h1>
		{/if}
	</div>
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>➡️</Button>
</div>
