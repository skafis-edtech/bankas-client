<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { categoryApi, problemApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Button, Input } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	let skfCode = writable('SKF-');

	let problemDisplayViewDto: ProblemDisplayViewDto | null = null;
	let problemCategory: Category | null = null;
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
			const response = await categoryApi.getPublicCategory(problemDisplayViewDto?.categoryId || '');
			problemCategory = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col my-8 container mx-auto">
	<p class="text-center text-sm my-0">Rodyti užduotį pagal SKF kodą</p>

	<form
		on:submit|preventDefault={() => fetchStuff()}
		class="flex flex-row max-w-min justify-center items-center m-auto"
	>
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
			class="block px-4 py-2 text-lg w-32 m-auto my-4"
			autocomplete="off"
		/>
		<Button class="ml-3 py-3" type="submit">Rodyti</Button>
	</form>
	{#if problemDisplayViewDto && problemCategory}
		<div class="flex justify-end">
			<Button
				color="red"
				class="w-28 mb-2"
				on:click={() => {
					problemDisplayViewDto = null;
					problemCategory = null;
				}}>Uždaryti</Button
			>
		</div>
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
				categoryName: problemCategory.name,
				source: 'Dar neįgyvendinta...'
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
