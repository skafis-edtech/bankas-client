<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchData, type Data } from '$services/dataService';
	import Problem from '$components/ui/Problem.svelte';
	import FindById from '$components/layout/FindById.svelte';

	let data: Data = { problems: {}, categories: {} };
	let loading: boolean = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			data = await fetchData();
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<FindById />
<div class="text-center">
	<h1 class="text-2xl font-semibold mb-4">Kategorijos</h1>
	<p>
		Norite įkelti savo užduotis ar patvirtinti pateiktas kitų? <a
			class="text-blue-800 underline"
			href="/register">Registruokitės!</a
		>
	</p>
</div>
{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div class="container mx-auto p-4">
		{#each Object.entries(data.problems) as [id, problem]}
			<Problem
				problemAllData={{
					id: id,
					problemText: problem.problemText,
					problemImage: problem.problemImage,
					answerText: problem.answerText,
					answerImage: problem.answerImage,
					createdOn: problem.createdOn,
					category: data.categories[problem.categoryId]?.name,
					author: data.categories[problem.categoryId]?.createdBy
				}}
			/>
		{/each}
	</div>
{/if}
