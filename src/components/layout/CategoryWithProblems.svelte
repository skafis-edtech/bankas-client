<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { publicApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto, Source } from '$services/gen-client';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let category: Category;
	export let searchValue: string;

	let problems: ProblemDisplayViewDto[] = [];
	let problemCount: number | null = null;

	onMount(async () => {
		if (category.id !== '') {
			const response = await publicApi.getCategoryProblemCount(category.id);
			problemCount = response.data.count;
		} else {
			const response = await publicApi.getUnsortedProblemsCount();
			problemCount = response.data.count;
		}
	});

	let isLoaded = writable(false);
	let isOpen = false;

	$: if (isOpen) {
		loadProblems();
	}

	async function loadProblems() {
		if (!isOpen || $isLoaded) return;
		if (category.id === '') {
			const response = await publicApi.getProblemsUnsorted();
			problems = response.data;
		} else {
			const response = await publicApi.getProblemsByCategory(category.id);
			problems = response.data;
		}

		isLoaded.set(true);
	}
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 my-4">
		<span slot="header" class="text-black flex justify-between items-center w-full">
			<p>
				{#if searchValue}
					{@html category.name.replace(new RegExp(searchValue, 'gi'), '<mark>$&</mark>')}
				{:else}
					{category.name}
				{/if}
			</p>
			<p class="ml-auto text-right mr-2"><strong>({problemCount})</strong></p>
		</span>

		<h5 class="text-xl">{category.description}</h5>
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
							categoryId: problem.categoryId,
							sourceId: problem.sourceId
						}}
					/>
				</div>
			{/each}
		</div>
	</AccordionItem>
</Accordion>
