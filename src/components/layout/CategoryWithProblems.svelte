<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { publicApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let category: Category;

	let problems: ProblemDisplayViewDto[] = [];
	let isLoaded = writable(false);
	let isOpen = false;

	$: if (isOpen) {
		loadProblems();
	}

	async function loadProblems() {
		if (!isOpen || $isLoaded) return;
		const response = await publicApi.getProblemsByCategory(category.id);
		problems = response.data;
		isLoaded.set(true);
	}
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 my-4">
		<span slot="header" class="text-black">{category.name}</span>
		<div>{category.description}</div>
		<div class="container mx-auto">
			{#each problems as problem (problem.id)}
				<div class="my-3">
					<ProblemComponent
						problemMainData={{
							skfCode: problem.skfCode,
							problemText: problem.problemText,
							problemImageSrc: problem.problemImageSrc,
							answerText: problem.answerText,
							answerImageSrc: problem.answerImageSrc
						}}
						problemMetaData={{
							author: 'Dar neįgyvendinta...',
							categoryName: category.name,
							source: 'Dar neįgyvendinta...'
						}}
					/>
				</div>
			{/each}
		</div>
	</AccordionItem>
</Accordion>
