<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { approvalApi } from '$services/apiService';
	import { type ProblemDisplayViewDto, type Source } from '$services/gen-client';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let source: Source;

	let problems: ProblemDisplayViewDto[] = [];
	let isLoaded = writable(false);
	let isOpen = false;

	$: if (isOpen) {
		loadProblems();
	}

	async function loadProblems() {
		if (!isOpen || $isLoaded) return;
		const response = await approvalApi.getProblemsBySource(source.id);
		problems = response.data;
		isLoaded.set(true);
	}
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 mb-4">
		<span slot="header" class="text-black">{source.name} </span>
		<h3 class="text-xl">{source.description}</h3>
		<p>
			<AuthorLink author={source.author} />
		</p>
		<p>sukurta: {getNiceTimeString(source.createdOn)}</p>
		<p>pakeista: {getNiceTimeString(source.lastModifiedOn)}</p>
		<div class="container mx-auto">
			{#each problems as problem (problem.id)}
				<div class="my-3">
					<ProblemComponent
						problemMainData={{
							skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
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
