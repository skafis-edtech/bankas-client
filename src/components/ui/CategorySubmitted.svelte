<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { AccordionItem, Badge, Button, P } from 'flowbite-svelte';
	import {
		UnderReviewCategoryReviewStatusEnum,
		type Category,
		type UnderReviewCategory
	} from '$services/gen-client';
	import { goto } from '$app/navigation';
	import { categoryApi } from '$services/apiService';
	import { currentUser } from '$lib/stores';
	import { onMount } from 'svelte';
	import { EditOutline, PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';

	export let category: Category | UnderReviewCategory;
	export let operationDone: Writable<boolean>;

	const open = writable(false);

	onMount(() => {
		operationDone.set(false);
	});

	const handleDelete = async (categoryId: string, event: Event) => {
		event.stopPropagation();
		const confirmed = confirm(
			'Ar tikrai norite ištrinti kategoriją su visais jai priklausančiais uždaviniais?'
		);
		if (confirmed) {
			await categoryApi.deleteUnderReviewCategory(categoryId);
			operationDone.set(true);
		}
	};

	const handleEdit = (event: Event) => {
		event.stopPropagation();
		alert('TODO: send PUT request');
	};

	const handleAddTask = (categoryId: string, event: Event) => {
		event.stopPropagation();
		goto(`/submit-new-problem/${categoryId}`);
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
					<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
				{/if}
				{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
					<Badge color="red" class="ml-2">Atmesta</Badge>
				{/if}
				{#if category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Pending || category.reviewStatus === UnderReviewCategoryReviewStatusEnum.Rejected}
					<Button
						color="red"
						on:click={(event) => handleDelete(category.id, event)}
						class="p-2 mx-1"><TrashBinSolid /></Button
					>
					<Button color="yellow" on:click={handleEdit} class="p-2 mx-1" title="ji"
						><EditOutline /></Button
					>
				{/if}
			{/if}

			<Button
				color="green"
				on:click={(event) => handleAddTask(category.id, event)}
				class="p-2 ml-1 mr-4"
				><PlusOutline />
			</Button>
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
		{#if 'approvedBy' in category}
			<p><strong>Approved By:</strong> {category.approvedBy}</p>
			<p><strong>Approved On:</strong> {category.approvedOn}</p>
		{/if}
	</div>
</AccordionItem>
