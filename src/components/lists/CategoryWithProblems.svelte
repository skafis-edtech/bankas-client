<script lang="ts">
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { viewApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { normalizeString } from '$utils/helpers';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let category: Category;
	export let searchValue: string;

	let problems: ProblemDisplayViewDto[] = [];
	let problemCount: number | null = null;

	let isLoaded = writable(false);
	let isOpen = false;

	$: if (isOpen) {
		loadProblems();
	}

	async function loadProblems() {
		if (!isOpen || $isLoaded) return;
		if (category.id === '') {
			const response = await viewApi.getProblemsUnsorted();
			problems = response.data;
		} else {
			const response = await viewApi.getProblemsByCategory(category.id);
			problems = response.data;
		}

		isLoaded.set(true);
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
			<p class="ml-auto text-right mr-2"><strong>({problemCount})</strong></p>
		</span>

		<MarkdownDisplay value={category.description} />

		<div class="container mx-auto">
			{#each problems as problem (problem.id)}
				<div class="my-3">
					<ProblemComponent
						problemMainData={{
							skfCode: problem.skfCode,
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
			{/each}
		</div>
	</AccordionItem>
</Accordion>
