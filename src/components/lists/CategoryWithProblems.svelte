<script lang="ts">
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { categoryApi, categoryViewApi } from '$services/apiService';
	import type { CategoryDisplayDto, ProblemDisplayViewDto } from '$services/gen-client';
	import { normalizeString } from '$utils/helpers';
	import { Accordion, AccordionItem, Skeleton, Button } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { RandomContext } from '../../types';
	import { CategoryDisplayEnum, SourceFilterOptionEnum } from '../../enums';
	import { goto } from '$app/navigation';
	import { successStore } from '$lib/stores';

	export let category: CategoryDisplayDto;
	export let searchValue: string;
	export let displayType: CategoryDisplayEnum = CategoryDisplayEnum.DISPLAY;
	export let sourceIds: string[] = [];
	export let filterOption: SourceFilterOptionEnum = SourceFilterOptionEnum.IGNORE;

	let problems: (ProblemDisplayViewDto | null)[] = [];

	let isOpen = false;
	let page = 0;
	const pageSize = 5;
	let isFetching = false;
	let listContainer: HTMLElement | null = null;

	const { seed } = getContext('randomContext') as RandomContext;

	$: if (sourceIds || filterOption) {
		if (isOpen) {
			page = 0;
			problems = [];
			loadProblems();
		}
	}

	async function loadProblems() {
		if (isFetching) return;
		isFetching = true;
		problems = [...problems, ...Array.from({ length: pageSize }, () => null)];

		if (filterOption === SourceFilterOptionEnum.IGNORE) {
			const response = await categoryViewApi.getProblemsByCategory(
				category.id,
				seed,
				page,
				pageSize
			);
			const startIndex = problems.length - pageSize;
			problems = [...problems.slice(0, startIndex), ...response.data];
			page++;
			isFetching = false;
			return;
		} else if (filterOption === SourceFilterOptionEnum.EXCEPT) {
			const response = await categoryViewApi.getProblemsByCategory(
				category.id,
				seed,
				page,
				pageSize,
				sourceIds,
				undefined
			);
			const startIndex = problems.length - pageSize;
			problems = [...problems.slice(0, startIndex), ...response.data];
			page++;
			isFetching = false;
			return;
		} else if (filterOption === SourceFilterOptionEnum.ONLY) {
			const response = await categoryViewApi.getProblemsByCategory(
				category.id,
				seed,
				page,
				pageSize,
				undefined,
				sourceIds
			);
			const startIndex = problems.length - pageSize;
			problems = [...problems.slice(0, startIndex), ...response.data];
			page++;
			isFetching = false;
			return;
		}
	}

	function highlightSearch(text: string, search: string): string {
		if (!search) return text;
		const normalizedText = normalizeString(text);
		const normalizedSearch = normalizeString(search);
		const regex = new RegExp(normalizedSearch, 'gi');
		const matchIndices = [];

		let match;
		while ((match = regex.exec(normalizedText)) !== null) {
			matchIndices.push({ start: match.index, end: regex.lastIndex });
		}

		let highlightedText = '';
		let currentIndex = 0;

		for (const { start, end } of matchIndices) {
			highlightedText +=
				text.substring(currentIndex, start) + '<mark>' + text.substring(start, end) + '</mark>';
			currentIndex = end;
		}

		highlightedText += text.substring(currentIndex);

		return highlightedText;
	}

	async function deleteCategory(categoryId: string) {
		if (
			!confirm(
				'Ar tikrai norite ištrinti kategoriją? Iš visų šios kategorijos užduočių bus išimta ši kategorija.'
			)
		)
			return;
		await categoryApi.deleteCategory(categoryId);
		successStore.set('Kategorija ištrinta sėkmingai');
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleScroll() {
		if (
			listContainer &&
			listContainer.getBoundingClientRect().bottom - window.innerHeight < 0 &&
			!isFetching &&
			problems.length < category.problemCount
		) {
			loadProblems();
		}
	}
</script>

<Accordion>
	<AccordionItem
		bind:open={isOpen}
		activeClass="bg-slate-200 my-4"
		inactiveClass="bg-slate-200 my-4"
	>
		<span slot="header" class="text-black flex justify-between items-center w-full">
			<p>
				{#if searchValue}
					{@html highlightSearch(category.name, searchValue)}
				{:else}
					{category.name}
				{/if}
			</p>
			<p class="ml-auto text-right mr-2"><strong>({category.problemCount})</strong></p>
		</span>
		{#if displayType === CategoryDisplayEnum.MANAGE}
			<div class="flex justify-end">
				<Button color="primary" on:click={() => goto(`/categories/edit-category/${category.id}`)}
					>Redaguoti kategorijos informaciją</Button
				>
			</div>
			<div class="flex justify-end">
				<Button color="red" on:click={() => deleteCategory(category.id)}>Ištrinti kategoriją</Button
				>
			</div>
		{/if}
		<MarkdownDisplay value={category.description} />

		<div class="container mx-auto" bind:this={listContainer}>
			{#each problems as problem (problem?.id || Math.random())}
				{#if problem === null}
					<div class="my-3">
						<Skeleton size="xxl" />
					</div>
				{:else}
					<div class="w-full my-2">
						<ProblemComponent
							problemMainData={{
								skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
								problemText: problem.problemText,
								problemImageSrc: problem.problemImageSrc,
								answerText: problem.answerText,
								answerImageSrc: problem.answerImageSrc,
								categories: problem.categories,
								sourceId: problem.sourceId,
								visibility: problem.problemVisibility
							}}
						/>
					</div>
				{/if}
			{/each}
		</div>
		<!-- Manual load more button for fallback -->
		{#if problems.length < category.problemCount}
			<button on:click={loadProblems} class="my-2">
				Load more (+{category.problemCount - problems.length < 5
					? category.problemCount - problems.length
					: 5})
			</button>
		{/if}
	</AccordionItem>
</Accordion>
