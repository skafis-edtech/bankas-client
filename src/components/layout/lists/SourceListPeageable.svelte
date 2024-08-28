<script lang="ts">
	import { approvalApi, publicApi } from '$services/apiService';
	import { SourceDisplayDtoReviewStatusEnum, type SourceDisplayDto } from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import SourceWithProblems from './SourceWithProblems.svelte';
	import SourceManageBar from '$components/ui/SourceManageBar.svelte';

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
			const response = await approvalApi.getMySources(page, size, searchValue);
			sources = response.data;
		} else if (sourcesSubset === 'all') {
			const sourcesRes = await approvalApi.getPendingSources(page, size, searchValue);
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

	function removeSource(id: string) {
		//sources = sources.filter((source) => source.id !== id);
	}
</script>

<Search class="my-3" placeholder="Ieškoti" bind:value={searchValue} />

{#each Object.entries(sources) as [id, source]}
	<div class="relative">
		{#if sourcesSubset === 'mine' && source.reviewStatus !== SourceDisplayDtoReviewStatusEnum.Rejected}
			<SourceWithProblems {source} {searchValue} needApprovalStatusNone="status" />
		{/if}
		{#if sourcesSubset === 'approved' || sourcesSubset === 'author'}
			<SourceWithProblems
				{source}
				{searchValue}
				needApprovalStatusNone="none"
				showIndicator={false}
			/>
		{/if}
		{#if sourcesSubset === 'mine' && source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
			<SourceManageBar
				reviewStatus={source.reviewStatus}
				sourceId={source.id}
				reviewHistory={source.reviewHistory}
			/>
			<SourceWithProblems {source} {searchValue} needApprovalStatusNone="none" />
		{/if}
		{#if sourcesSubset === 'all'}
			<SourceWithProblems
				afterReview={() => removeSource(source.id)}
				{source}
				{searchValue}
				needApprovalStatusNone="approval"
				showIndicator={false}
			/>
		{/if}
	</div>
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>➡️</Button>
</div>
