<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import SourceManageBar from '$components/ui/SourceManageBar.svelte';
	import SourceReviewBar from '$components/ui/SourceReviewBar.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { approvalApi } from '$services/apiService';
	import {
		SourceReviewStatusEnum,
		type ProblemDisplayViewDto,
		type SourceDisplayDto
	} from '$services/gen-client';
	import { Accordion, AccordionItem, Button, Indicator, Review, Skeleton } from 'flowbite-svelte';

	export let source: SourceDisplayDto;
	export let searchValue: string;
	export let needApprovalStatusNone: 'approval' | 'status' | 'none' = 'none';
	export let showIndicator = true;

	let problems: (ProblemDisplayViewDto | null)[] = [];
	let isOpen = false;

	const pageSize = 5;
	let page = 0;
	let isFetching = false;

	async function loadProblems() {
		if (isFetching) return;
		isFetching = true;
		problems = [...problems, ...Array.from({ length: pageSize }, () => null)];
		const response = await approvalApi.getProblemsBySource(source.id, page, pageSize);
		const startIndex = problems.length - pageSize;
		problems = [...problems.slice(0, startIndex), ...response.data];
		page++;
		isFetching = false;
	}
</script>

<Accordion>
	<AccordionItem bind:open={isOpen} class="bg-slate-200 mb-4 ">
		<span slot="header" class="text-black flex justify-between items-center w-full">
			{#if showIndicator}
				<Indicator
					color={source.reviewStatus === SourceReviewStatusEnum.Pending
						? 'yellow'
						: source.reviewStatus === SourceReviewStatusEnum.Rejected
							? 'red'
							: 'green'}
					class="m-2"
				/>
			{/if}
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

			{#if needApprovalStatusNone === 'approval'}
				<SourceReviewBar
					reviewStatus={source.reviewStatus}
					sourceId={source.id}
					reviewHistory={source.reviewHistory}
				/>
			{/if}
			{#if needApprovalStatusNone === 'status'}
				<SourceManageBar
					reviewStatus={source.reviewStatus}
					sourceId={source.id}
					reviewHistory={source.reviewHistory}
				/>
			{/if}

			<div class="container mx-auto">
				{#each problems as problem (problem?.id || Math.random())}
					{#if problem === null}
						<Skeleton size="xxl" class="my-3" />
					{:else}
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
					{/if}
				{/each}
			</div>
			<Button on:click={loadProblems} class="my-2">Rodyti +5 užduotis</Button>
		</div></AccordionItem
	>
</Accordion>
