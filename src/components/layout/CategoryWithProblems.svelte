<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { problemApi, problemOldApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let loading: boolean = true;
	let error: string | null = null;
	let problems: ProblemDisplayViewDto[] = [];

	export let category: Category;

	onMount(async () => {
		const response = await problemOldApi.getPublicProblemsByCategory(category.id);
		problems = response.data;
	});
</script>

<Accordion>
	<AccordionItem class="bg-slate-200 my-4">
		<span slot="header" class="text-black">{category.name}</span>
		{#if loading}
			<p>Kraunasi...</p>
		{:else if error}
			<p>Klaida: {error}</p>
		{:else}
			<div class="container mx-auto">
				{#each Object.entries(problems) as [id, problem]}
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
								categoryName: category.name,
								source: 'Dar neįgyvendinta...'
							}}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</AccordionItem>
</Accordion>
