<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import SourceManageBar from '$components/submit-dashboard/SourceManageBar.svelte';
	import SourceReviewBar from '$components/review-dashboard/SourceReviewBar.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { viewApi } from '$services/apiService';
	import {
		SourceDisplayDtoReviewStatusEnum,
		type ProblemDisplayViewDto,
		type SourceDisplayDto
	} from '$services/gen-client';
	import { Accordion, AccordionItem, Button, Indicator, Skeleton } from 'flowbite-svelte';

	export let source: SourceDisplayDto;
	export let searchValue: string;
	export let needApprovalStatusNone: 'approval' | 'status' | 'none' = 'none';
	export let showIndicator = true;
	export let afterReview: () => void = () => {};

	let problems: (ProblemDisplayViewDto | null)[] = [];
	let isOpen = false;

	$: if (isOpen && problems.length === 0 && source.problemCount > 0) {
		loadProblems();
	}

	const pageSize = 5;
	let page = 0;
	let isFetching = false;

	async function loadProblems() {
		if (isFetching) return;
		isFetching = true;
		problems = [...problems, ...Array.from({ length: pageSize }, () => null)];
		const response = await viewApi.getProblemsBySource(source.id, page, pageSize);
		const startIndex = problems.length - pageSize;
		problems = [...problems.slice(0, startIndex), ...response.data];
		page++;
		isFetching = false;
	}
</script>

<Accordion>
	<AccordionItem
		bind:open={isOpen}
		class={`bg-slate-200 mb-4 ${!source.name.includes('(DAR TVARKOMA)') && needApprovalStatusNone === 'approval' ? 'bg-green-200' : ''} `}
	>
		<span slot="header" class="text-black flex justify-between items-center w-full">
			{#if showIndicator}
				<Indicator
					color={source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending
						? 'yellow'
						: source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected
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
			<p class="ml-auto text-right mr-2">
				<strong>({source.problemCount})</strong> <em>{source.authorUsername}</em>
			</p>
		</span>
		<div>
			{#if needApprovalStatusNone === 'approval'}
				<SourceReviewBar
					afterReview={() => {
						afterReview();
					}}
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
					visibility={source.visibility}
				/>
			{/if}
			<MarkdownDisplay value={source.description} />

			<p>
				Autorius: <AuthorLink author={source.authorUsername} />
			</p>
			<p>Sukurta: {getNiceTimeString(source.createdOn)}</p>
			<p>Pakeista: {getNiceTimeString(source.lastModifiedOn)}</p>

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
									sourceId: problem.sourceId,
									visibility: problem.problemVisibility
								}}
							/>
						</div>
					{/if}
				{/each}
			</div>
			{#if problems.length < source.problemCount}
				<Button on:click={loadProblems} class="my-2"
					>Rodyti +{source.problemCount - problems.length < 5
						? source.problemCount - problems.length
						: 5} užd.</Button
				>
			{/if}
		</div></AccordionItem
	>
</Accordion>
