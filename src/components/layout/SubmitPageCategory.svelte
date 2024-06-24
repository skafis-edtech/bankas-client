<script lang="ts">
	import { writable } from 'svelte/store';
	import { AccordionItem, Badge, Button } from 'flowbite-svelte';
	import {
		UnderReviewCategoryReviewStatusEnum,
		type Category,
		type UnderReviewCategory
	} from '$services/gen-client';
	import { goto } from '$app/navigation';
	import { categoryApi } from '$services/apiService';

	export let category: Category | UnderReviewCategory;
	export let isOwnedByUser: boolean = false;
	export let isPending: boolean = false;
	export let isRejected: boolean = false;

	const open = writable(false);

	const handleDelete = async (categoryId: string) => {
		const confirmed = confirm(
			'Ar tikrai norite ištrinti kategoriją su visais jai priklausančiais uždaviniais?'
		);
		if (confirmed) {
			await categoryApi.deleteUnderReviewCategory(categoryId);
			alert('Kategorija ištrinta');
		}
	};
</script>

<AccordionItem class="bg-slate-200 my-4">
	<span slot="header" class="text-black flex flex-row items-center justify-between w-full">
		<div class="flex-none">
			<p>{category.name}</p>
		</div>
		<div>
			{#if isOwnedByUser}
				{#if isPending}
					<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
				{/if}
				{#if isRejected}
					<Badge color="red" class="ml-2">Atšaukta</Badge>
				{/if}
			{/if}
			{#if isPending || isRejected}
				<Button color="red" on:click={() => handleDelete(category.id)} class="p-2 mx-2"
					>Ištrinti</Button
				>
				<Button color="yellow" on:click={() => alert('TODO: send PUT request')} class="p-2 mx-2"
					>Redaguoti</Button
				>
			{/if}
			<Button
				color="green"
				on:click={() => goto(`/submit-new-problem/${category.id}`)}
				class="p-2 mx-2">Pridėti užduočių</Button
			>
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
