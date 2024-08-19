<script lang="ts">
	import { publicApi } from '$services/apiService';
	import type { SourceDisplayDto } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import SourceWithProblems from './SourceWithProblems.svelte';

	let sources: SourceDisplayDto[] = [];
	export let searchValue = '';
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
			await fetchSources();
		}, 1000);
	}

	async function fetchSources() {
		const sourcesRes = await publicApi.getApprovedSources(page, size, searchValue);
		sources = sourcesRes.data;
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
</script>

<Search class="my-3" placeholder="Ieškoti" bind:value={searchValue} />

{#each Object.entries(sources) as [id, source]}
	<SourceWithProblems {source} {searchValue} />
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️ Ankstesnis</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>Sekantis ➡️</Button>
</div>
