<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { AccordionItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let loading: boolean = true;
	let error: string | null = null;
	let problems: any[] = [];

	export let category: any;

	onMount(async () => {
		try {
			// problems = await fetchProblemsOfCategory(category.id);
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<AccordionItem class="bg-slate-200 my-4 ">
	<span slot="header" class="text-black">{category.name}</span>
	<p><strong>Aprašymas: </strong>{category.description}</p>
	<p><strong>Autorius: </strong>{category.createdBy}</p>
	<p>
		<strong>Sukurta: </strong>{new Date(category?.createdOn || '').toLocaleDateString('lt-LT') +
			' ' +
			new Date(category?.createdOn || '').toLocaleTimeString('lt-LT')}
	</p>
	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p>Error: {error}</p>
	{:else}
		<div class="container mx-auto">
			{#each Object.entries(problems) as [id, problem]}
				<ProblemComponent
					problemAllData={{
						id: problem.id,
						problemText: problem.problemText,
						problemImage: problem.problemImage,
						answerText: problem.answerText,
						answerImage: problem.answerImage,
						createdOn: problem.createdOn,
						category: category?.name,
						author: category?.createdBy
					}}
				/>
			{/each}
		</div>
	{/if}
</AccordionItem>
