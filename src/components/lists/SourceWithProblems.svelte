<script lang="ts">
	import AuthorLink from '$components/ui/AuthorLink.svelte';
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import SourceManageBar from '$components/submit-dashboard/SourceManageBar.svelte';
	import SourceReviewBar from '$components/review-dashboard/SourceReviewBar.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { sourceViewApi } from '$services/apiService';
	import {
		SourceDisplayDtoReviewStatusEnum,
		type ProblemDisplayViewDto,
		type SourceDisplayDto
	} from '$services/gen-client';
	import { Skeleton } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Accordion, AccordionItem, Indicator } from 'flowbite-svelte';
	import { SourceDisplayEnum } from '../../enums';

	export let source: SourceDisplayDto;
	export let searchValue: string;
	export let displayType: SourceDisplayEnum = SourceDisplayEnum.DISPLAY;
	export let showIndicator = true;
	export let afterReview: () => void = () => {};

	let problems: (ProblemDisplayViewDto | null)[] = [];
	let isOpen = false;
	let page = 0;
	let isFetching = false;
	const pageSize = 5;
	let listContainer: HTMLElement | null = null;

	// Function to load problems
	async function loadProblems() {
		if (isFetching) return;
		isFetching = true;
		problems = [...problems, ...Array.from({ length: pageSize }, () => null)];
		const response = await sourceViewApi.getProblemsBySource(source.id, page, pageSize);
		const startIndex = problems.length - pageSize;
		problems = [...problems.slice(0, startIndex), ...response.data];
		page++;
		isFetching = false;
	}

	function handleScroll() {
		if (
			listContainer &&
			listContainer.getBoundingClientRect().bottom - window.innerHeight < 0 &&
			!isFetching &&
			problems.length < source.problemCount
		) {
			loadProblems();
		}
	}

	// Start loading problems when the accordion is opened
	$: if (isOpen && problems.length === 0 && source.problemCount > 0) {
		loadProblems();
	}

	// Listen for scroll events on window
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<Accordion>
	<AccordionItem
		bind:open={isOpen}
		activeClass="bg-slate-200 mb-4"
		inactiveClass="bg-slate-200 mb-4"
	>
		<span slot="header" class="text-black flex justify-between items-center w-full">
			{#if showIndicator}
				{#if source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending}
					<Indicator color="yellow" class="mr-2" />
				{:else if source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
					<Indicator color="red" class="mr-2" />
				{:else if source.reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved}
					<Indicator color="green" class="mr-2" />
				{:else}
					<h1>Klaida: susisiekite su administratoriumi</h1>
				{/if}
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
		<div bind:this={listContainer}>
			{#if displayType === SourceDisplayEnum.REVIEW}
				<SourceReviewBar
					{afterReview}
					reviewStatus={source.reviewStatus}
					sourceId={source.id}
					reviewHistory={source.reviewHistory}
				/>
			{/if}
			{#if displayType === SourceDisplayEnum.MANAGE}
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
						<div class="my-3">
							<Skeleton size="xxl" />
						</div>
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
			{#if problems.length < source.problemCount}
				<button on:click={loadProblems} class="my-2">
					Load more (+{source.problemCount - problems.length < 5
						? source.problemCount - problems.length
						: 5})
				</button>
			{/if}
		</div>
	</AccordionItem>
</Accordion>
