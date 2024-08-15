<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { approvalApi } from '$services/apiService';
	import { type ProblemDisplayViewDto, type SourceDisplayDto } from '$services/gen-client';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let source: SourceDisplayDto;
	export let searchValue: string;

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
		<span slot="header" class="text-black flex justify-between items-center w-full">
			<p>
				{#if searchValue}
					{@html source.name.replace(new RegExp(searchValue, 'gi'), '<mark>$&</mark>')}
				{:else}
					{source.name}
				{/if}
			</p>
			<p class="ml-auto text-right mr-2"><strong>({source.authorUsername})</strong></p>
		</span>
		<MarkdownDisplay value={source.description} />
		<div>
			<p>
				Autorius: <AuthorLink author={source.authorUsername} />
			</p>
			<p>Sukurta: {getNiceTimeString(source.createdOn)}</p>
			<p>Pakeista: {getNiceTimeString(source.lastModifiedOn)}</p>
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
								categories: problem.categories,
								sourceId: problem.sourceId
							}}
						/>
					</div>
				{/each}
			</div>
		</div></AccordionItem
	>
</Accordion>
