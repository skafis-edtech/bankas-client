<script lang="ts">
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { categoryViewApi } from '$services/apiService';
	import type { CategoryDisplayDto, ProblemDisplayViewDto } from '$services/gen-client';
	import { normalizeString } from '$utils/helpers';
	import { Accordion, AccordionItem, Skeleton } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let category: CategoryDisplayDto;
	export let searchValue: string;

	let problems: (ProblemDisplayViewDto | null)[] = [];

	let isLoaded = writable(false);
	let isOpen = false;
	let page = 0;
	const pageSize = 5;
	let isFetching = false;

	$: if (isOpen) {
		loadProblems();
	}

	async function loadProblems() {
		if (isFetching) return;
		isFetching = true;
		problems = [...problems, ...Array.from({ length: pageSize }, () => null)];
		const response = await categoryViewApi.getProblemsByCategory(category.id, page, pageSize);
		const startIndex = problems.length - pageSize;
		problems = [...problems.slice(0, startIndex), ...response.data];
		page++;
		isFetching = false;
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
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 my-4">
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

		<MarkdownDisplay value={category.description} />

		<div class="container mx-auto">
			{#each problems as problem (problem?.id || Math.random())}
				{#if problem === null}
					<Skeleton size="xxl" class="my-3" />
				{:else}
					<div class="flex gap-2 my-2">
						<div class="text-sm">{problem.sourceListNr}.</div>
						<div class="w-full">
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
