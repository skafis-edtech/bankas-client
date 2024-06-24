<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { categoryApi, problemApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { AccordionItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let loading: boolean = true;
	let error: string | null = null;
	let problems: ProblemDisplayViewDto[] = [];

	export let category: Category;

	onMount(async () => {
		try {
			const response = await problemApi.getPublicProblemsByCategory(category.id);
			problems = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<AccordionItem class="bg-slate-200 my-4">
	<span slot="header" class="text-black">{category.name}</span>
	<p><strong>Aprašymas: </strong>{category.description}</p>
	<p>
		<strong>Autorius: </strong><a href="/user/{category.author}" class="underline"
			>{category.author}</a
		>
	</p>
	<p>
		<strong>Sukurta: </strong>{getNiceTimeString(category.createdOn)}
	</p>
	<p>
		<strong>Paskutinį kartą keista: </strong>{getNiceTimeString(category.lastModifiedOn)}
	</p>
	<p>
		<strong>Patvirtino naudotojas: </strong>
		<a href="/user/{category.approvedBy}" class="underline">{category.approvedBy}</a>
	</p>
	<p>
		<strong>Patvirtinta: </strong>
		{getNiceTimeString(category.approvedOn)}
	</p>
	{#if loading}
		<p>Kraunasi...</p>
	{:else if error}
		<p>Klaida: {error}</p>
	{:else}
		<div class="container mx-auto">
			{#each Object.entries(problems) as [id, problem]}
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
						createdOn: problem.createdOn,
						lastModifiedOn: problem.lastModifiedOn,
						approvedBy: problem.approvedBy,
						approvedOn: problem.approvedOn,
						categoryName: category.name,
						categoryDescription: category.description,
						categoryAuthor: category.author,
						categoryCreatedOn: category.createdOn,
						categoryLastModifiedOn: category.lastModifiedOn,
						categoryApprovedBy: category.approvedBy,
						categoryApprovedOn: category.approvedOn
					}}
				/>
			{/each}
		</div>
	{/if}
</AccordionItem>
