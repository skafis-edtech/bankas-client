<script lang="ts">
	import {
		GetSourcesByAuthorSortByEnum,
		SourceDisplayDtoReviewStatusEnum,
		SourceSubmitDtoVisibilityEnum,
		type SourceDisplayDto
	} from '$services/gen-client';
	import { Button, Search } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import SourceWithProblems from './SourceWithProblems.svelte';
	import SourceManageBar from '$components/submit-dashboard/SourceManageBar.svelte';
	import { reviewApi, sourceViewApi } from '$services/apiService';
	import { SourceDisplayEnum, SourceSubsetEnum } from '../../enums';
	import type { AuthContext } from '../../types';

	let sources: SourceDisplayDto[] = [];
	export let searchValue = '';
	export let sourcesSubset: SourceSubsetEnum;
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
			history.replaceState(null, '', `?search=${searchValue}`);
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
</script>

<Search class="my-3" placeholder="Ieškoti pagal pavadinimą ir aprašymą" bind:value={searchValue} />

{#each Object.entries(sources) as [id, source]}
	<div class="relative">
		{#if sourcesSubset === SourceSubsetEnum.AVAILABLE && source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
			<SourceManageBar
				reviewStatus={source.reviewStatus}
				sourceId={source.id}
				reviewHistory={source.reviewHistory}
				visibility={source.visibility}
			/>
			<SourceWithProblems {source} {searchValue} displayType={SourceDisplayEnum.DISPLAY} />
		{:else if sourcesSubset === SourceSubsetEnum.AVAILABLE && source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved && source.authorUsername === $user.username}
			<SourceWithProblems {source} {searchValue} displayType={SourceDisplayEnum.MANAGE} />
		{:else if sourcesSubset === SourceSubsetEnum.AVAILABLE && source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved && source.authorUsername !== $user.username}
			<SourceWithProblems
				source={{ ...source, name: '🌐 ' + source.name }}
				{searchValue}
				displayType={SourceDisplayEnum.DISPLAY}
				showIndicator={false}
			/>
		{:else if sourcesSubset === SourceSubsetEnum.AVAILABLE && source.visibility === SourceSubmitDtoVisibilityEnum.Private}
			<SourceWithProblems
				source={{ ...source, name: '🔒 ' + source.name }}
				{searchValue}
				displayType={SourceDisplayEnum.MANAGE}
				showIndicator={false}
			/>
		{:else if sourcesSubset === SourceSubsetEnum.PENDING}
			<SourceWithProblems
				afterReview={() => removeSource(source.id)}
				{source}
				{searchValue}
				displayType={SourceDisplayEnum.REVIEW}
			/>
		{:else if sourcesSubset === SourceSubsetEnum.AUTHOR}
			<SourceWithProblems
				source={{ ...source, name: '🌐 ' + source.name }}
				{searchValue}
				displayType={SourceDisplayEnum.DISPLAY}
				showIndicator={false}
			/>
		{:else}
			<h1>Klaida: susisiekite su administratoriumi!</h1>
			<p>source: {source.name}</p>
			<p>sourcesSubset: {sourcesSubset}</p>
			<p>source.visibility: {source.visibility}</p>
		{/if}
	</div>
{/each}

<div class="pagination">
	<Button color="dark" on:click={() => changePage(-1)}>⬅️</Button>
	<span class="mx-3">{page + 1} puslapis</span>
	<Button color="dark" on:click={() => changePage(1)}>➡️</Button>
</div>
