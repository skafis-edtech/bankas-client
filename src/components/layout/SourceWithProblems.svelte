<script lang="ts">
	import { goto } from '$app/navigation';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { problemOldApi } from '$services/apiService';
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
		alert('This will load problems for source with id: ' + source.id);
		// if (!isOpen || $isLoaded) return;
		// const response = await problemOldApi.getPublicProblemsByCategory(category.id);
		// problems = response.data;
		// isLoaded.set(true);
	}

	function handleDelete(id: string) {
		console.log('This will delete source with id:', id);
	}
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 my-4">
		<span slot="header" class="text-black"
			>{source.name}
			{#if source.reviewStatus === SourceReviewStatusEnum.Pending}
				<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
			{/if}
			{#if source.reviewStatus === SourceReviewStatusEnum.Rejected}
				<Badge color="red" class="ml-2">Atmesta</Badge>
			{/if}
			{#if source.reviewStatus === SourceReviewStatusEnum.Approved}
				<Badge color="green" class="ml-2">Patvirtinta</Badge>
			{/if}
			<Button color="red" on:click={() => handleDelete(source.id)} class="p-2 mx-1"
				><TrashBinSolid /></Button
			>
			<Button color="yellow" on:click={() => goto(`/edit-source/${source.id}`)} class="p-2 mx-1"
				><EditOutline /></Button
			>
		</span>
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
							author: problem.author,
							categoryName: 'Dar neįgyvendinta...',
							source: source.name
						}}
					/>
				</div>
			{/each}
		</div>
	</AccordionItem>
</Accordion>
