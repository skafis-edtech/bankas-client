<script lang="ts">
	import { approvalApi, publicApi } from '$services/apiService';
	import type { SourceDisplayDto } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import SourceWithProblems from './SourceWithProblems.svelte';
	import SourceManageBar from '$components/ui/SourceManageBar.svelte';
	import SourceReviewBar from '$components/ui/SourceReviewBar.svelte';

	let sources: SourceDisplayDto[] = [];
	export let searchValue = '';
	export let sourcesSubset: 'all' | 'approved' | 'mine' | 'author';
	export let author: string = '';
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
		if (sourcesSubset === 'mine') {
			const sourcesRes = await approvalApi.getMySources(page, size, searchValue);
			sources = sourcesRes.data;
		} else if (sourcesSubset === 'all') {
			const sourcesRes = await approvalApi.getSources(page, size, searchValue);
			sources = sourcesRes.data;
		} else if (sourcesSubset === 'approved') {
			const sourcesRes = await publicApi.getApprovedSources(page, size, searchValue);
			sources = sourcesRes.data;
		} else if (sourcesSubset === 'author') {
			if (!author) {
				console.error('Author not provided');
				return;
			}
			const sourcesRes = await publicApi.getSourcesByAuthor(author, page, size, searchValue);
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
</script>

<Search class="my-3" placeholder="Ieškoti" bind:value={searchValue} />

{#each Object.entries(sources) as [id, source]}
	{#if sourcesSubset === 'mine'}
		<SourceManageBar
			reviewStatus={source.reviewStatus}
			sourceId={source.id}
			reviewHistory={source.reviewHistory}
		/>
	{:else if sourcesSubset === 'all'}
		<SourceReviewBar
			reviewStatus={source.reviewStatus}
			sourceId={source.id}
			reviewHistory={source.reviewHistory}
		/>
	{/if}
	<SourceWithProblems {source} {searchValue} />
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️ Ankstesnis</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>Sekantis ➡️</Button>
</div>
