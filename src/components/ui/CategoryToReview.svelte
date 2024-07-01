<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { AccordionItem, Badge, Button, P } from 'flowbite-svelte';
	import {
		UnderReviewCategoryReviewStatusEnum,
		type UnderReviewCategory
	} from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import { onMount } from 'svelte';

	export let category: UnderReviewCategory;
	export let operationDone: Writable<boolean>;

	const open = writable(false);

	onMount(() => {
		operationDone.set(false);
	});

	const handleReject = async (categoryId: string) => {
		const msg = prompt('Įveskite atmetimo priežastį (žinutę kategorijos autoriui):');
		if (!msg) {
			alert('Atmetimo priežastis privalo būti įvesta');
			return;
		}
		await categoryApi.rejectCategory(categoryId, { rejectionMessage: msg });
		operationDone.set(true);
	};

	const handleApprove = async (categoryId: string) => {
		await categoryApi.approveCategory(categoryId);
		operationDone.set(true);
	};
</script>

<AccordionItem class="bg-slate-200 my-4">
	<span slot="header" class="text-black flex flex-row items-center justify-between w-full">
		<div class="flex-none">
			<p>{category.name}</p>
		</div>
		<div>
			{#if 'reviewStatus' in category}
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
			{/if}
		</div>
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
</AccordionItem>
