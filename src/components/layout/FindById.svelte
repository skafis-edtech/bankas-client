<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { categoryApi, problemApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Button, Input } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	let skfCode = writable('SKF-');

	let problemDisplayViewDto: ProblemDisplayViewDto;
	let problemCategory: Category;
	let error = '';
	let loading = false;

	const fetchStuff = async () => {
		loading = true;
		try {
			const response = await problemApi.getPublicProblem($skfCode);
			problemDisplayViewDto = response.data;
		} catch (e: any) {
			error = e.message;
		}

		try {
			const response = await categoryApi.getPublicCategory(problemDisplayViewDto.categoryId);
			problemCategory = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col my-8 container mx-auto">
	<h1 class="text-2xl font-semibold text-center">Unikalus kodas</h1>
	<p class="text-center">Įveskite unikalų užduoties SKF kodą (skaičius)</p>
	<form on:submit|preventDefault={() => fetchStuff()} class="flex flex-col mb-8">
		<Input
			type="text"
			id="skf-code"
			bind:value={$skfCode}
			on:input={() => {
				if ($skfCode.slice(0, 4) !== 'SKF-') {
					skfCode.set('SKF-');
				}
				const numericPart = $skfCode.slice(4).replace(/\D/g, '');
				skfCode.set('SKF-' + numericPart);
			}}
			required
			placeholder="SKF-"
			class="block px-4 py-2 text-lg w-80 m-auto my-4"
		/>
		<Button class="m-auto text-center" type="submit">Rodyti</Button>
	</form>
	{#if problemDisplayViewDto && problemCategory}
		<ProblemComponent
			problemMainData={{
				skfCode: problemDisplayViewDto.skfCode,
				problemText: problemDisplayViewDto.problemText,
				problemImageSrc: problemDisplayViewDto.problemImageSrc,
				answerText: problemDisplayViewDto.answerText,
				answerImageSrc: problemDisplayViewDto.answerImageSrc
			}}
			problemMetaData={{
				author: problemDisplayViewDto.author,
				createdOn: problemDisplayViewDto.createdOn,
				lastModifiedOn: problemDisplayViewDto.lastModifiedOn,
				approvedBy: problemDisplayViewDto.approvedBy,
				approvedOn: problemDisplayViewDto.approvedOn,
				categoryName: problemCategory.name,
				categoryDescription: problemCategory.description,
				categoryAuthor: problemCategory.author,
				categoryCreatedOn: problemCategory.createdOn,
				categoryLastModifiedOn: problemCategory.lastModifiedOn,
				categoryApprovedBy: problemCategory.approvedBy,
				categoryApprovedOn: problemCategory.approvedOn
			}}
		/>
	{/if}
	{#if loading}
		<p class="text-center">Kraunasi...</p>
	{/if}
	{#if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{/if}
</div>
