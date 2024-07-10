<script lang="ts">
	import { goto } from '$app/navigation';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { approvalApi } from '$services/apiService';
	import {
		SourceReviewStatusEnum,
		type ProblemDisplayViewDto,
		type Source
	} from '$services/gen-client';
	import { Accordion, AccordionItem, Badge, Button } from 'flowbite-svelte';
	import { EditOutline, TrashBinSolid } from 'flowbite-svelte-icons';
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
	<AccordionItem bind:open={isOpen} class="bg-slate-200 my-4">
		<span slot="header" class="text-black">{source.name} </span>
		<div class="container mx-auto">
			{#each problems as problem (problem.id)}
				<div class="my-3">
					<ProblemComponent
						problemMainData={{
							skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
							problemText: problem.problemText,
							problemImageSrc: problem.problemImageSrc,
							answerText: problem.answerText,
							answerImageSrc: problem.answerImageSrc
						}}
						problemMetaData={{
							author: source.author,
							categoryName: 'Dar neįgyvendinta...',
							source: source.name
						}}
					/>
				</div>
			{/each}
		</div>
	</AccordionItem>
</Accordion>
