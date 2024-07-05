<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { Accordion, AccordionItem, Badge, Button } from 'flowbite-svelte';
	import {
		UnderReviewCategoryReviewStatusEnum,
		type Category,
		type UnderReviewCategory,
		type UnderReviewProblemDisplayViewDto
	} from '$services/gen-client';
	import { categoryApi, problemApi } from '$services/apiService';
	import { onMount } from 'svelte';
	import ProblemComponent from './ProblemComponent.svelte';

	export let category: UnderReviewCategory | Category;
	export let operationDone: Writable<boolean>;

	const open = writable(true);
	const problems: Writable<UnderReviewProblemDisplayViewDto[]> = writable([]);

	onMount(async () => {
		operationDone.set(false);
		try {
			const response = await problemApi.getUnderReviewProblemsByArbitraryCategory(category.id);
			problems.set(response.data);
			if (response.data.length === 0 && !('reviewStatus' in category)) {
				open.set(false);
			}
		} catch (e: any) {
			console.error(e);
		} finally {
			operationDone.set(true);
		}
	});

	const handleReject = async (categoryId: string) => {
		operationDone.set(false);
		const msg = prompt('Įveskite atmetimo priežastį (žinutę kategorijos autoriui):');
		if (!msg) {
			alert('Atmetimo priežastis privalo būti įvesta');
			return;
		}
		await categoryApi.rejectCategory(categoryId, { rejectionMessage: msg });
		operationDone.set(true);
	};

	const handleApprove = async (categoryId: string) => {
		operationDone.set(false);
		await categoryApi.approveCategory(categoryId);
		operationDone.set(true);
	};

	const handleApproveProblem = async (problemId: string) => {
		operationDone.set(false);
		await problemApi.approveProblem(problemId);
		operationDone.set(true);
	};

	const handleRejectProblem = async (problemId: string) => {
		operationDone.set(false);
		const msg = prompt('Įveskite atmetimo priežastį (žinutę užduoties autoriui):');
		if (!msg) {
			alert('Atmetimo priežastis privalo būti įvesta');
			return;
		}
		await problemApi.rejectProblem(problemId, { rejectionMessage: msg });
		operationDone.set(true);
	};
</script>

<Accordion>
	<AccordionItem
		class={`${$problems.length === 0 && !('reviewStatus' in category) ? 'bg-slate-50 my-1 p-1' : 'bg-slate-200 my-2'}`}
		open={$open}
	>
		<span slot="header" class="text-black flex flex-row items-center justify-between w-full">
			<div class="flex-none">
				<p>{category.name}</p>
			</div>
			{#if 'reviewStatus' in category}
				<!-- underReviewCategory -->
				<div>
					{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Pending}
						<Badge color="yellow" class="ml-2">Neperžiūrėta</Badge>
					{/if}
					{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
						<Badge color="red" class="ml-2">Atmesta</Badge>
					{/if}
					{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Pending || category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
						<Button color="red" on:click={() => handleReject(category.id)} class="p-2 mx-2"
							>Atmesti</Button
						>
						<Button color="green" on:click={() => handleApprove(category.id)} class="p-2 mx-2"
							>Patvirtinti</Button
						>
					{/if}
				</div>
			{:else}
				<!-- publicCategory -->
				<div>
					<Badge color="green" class="ml-2">Patvirtinta</Badge>
				</div>
			{/if}
		</span>
		<div>
			<p><strong>Description:</strong> {category.description}</p>
			<p><strong>Author:</strong> {category.author}</p>
			<p><strong>Created On:</strong> {category.createdOn}</p>
			<p><strong>Last Modified On:</strong> {category.lastModifiedOn}</p>
			{#if 'reviewStatus' in category}
				<p><strong>Review Status:</strong> {category.reviewStatus}</p>
				{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
					<p><strong>Rejected By:</strong> {category.rejectedBy}</p>
					<p><strong>Rejected On:</strong> {category.rejectedOn}</p>
					<p><strong>Rejection Message:</strong> {category.rejectionMessage}</p>
				{/if}
			{/if}
		</div>
		{#if $problems.length === 0}
			<p>Nėra šios kategorijos uždavinių, pateiktų peržiūrai...</p>
		{:else}
			{#each $problems as problem}
				<div class="mt-6 p-1 bg-amber-300 rounded-t-lg flex justify-end gap-2 flex-wrap">
					<!-- I know.... Repetitive. One day gonna fix that -->
					{#if problem.reviewStatus === UnderReviewCategoryReviewStatusEnum.Pending}
						<Badge color="yellow" class="ml-2">Neperžiūrėta</Badge>
						<div>
							Anksčiau peržiūrėjo {problem.rejectedBy}. Laiku {problem.rejectedOn}.
							<strong>Žinutė: </strong>{problem.rejectionMessage}
						</div>
					{/if}
					{#if problem.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
						<Badge color="red" class="ml-2">Atmesta</Badge>
						<div>
							Peržiūrėjo {problem.rejectedBy}. Laiku {problem.rejectedOn}.
							<strong>Žinutė: </strong>{problem.rejectionMessage}
						</div>
					{/if}
					{#if problem.reviewStatus === UnderReviewCategoryReviewStatusEnum.Pending || problem.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
						<Button color="red" on:click={() => handleRejectProblem(problem.id)} class="p-2 mx-2"
							>Atmesti</Button
						>
						<Button color="green" on:click={() => handleApproveProblem(problem.id)} class="p-2 mx-2"
							>Patvirtinti</Button
						>
					{/if}
				</div>

				<ProblemComponent
					problemMainData={{
						skfCode: '🤷‍♂️',
						problemText: problem.problemText,
						problemImageSrc: problem.problemImageSrc,
						answerText: problem.answerText,
						answerImageSrc: problem.answerImageSrc
					}}
					problemMetaData={{
						author: problem.author,
						categoryName: '👻',
						source: '👻'
					}}
				/>
			{/each}
		{/if}
	</AccordionItem>
</Accordion>
