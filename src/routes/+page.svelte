<!-- <h1>Home</h1>
<p>Find by unique SKF code</p>
<p>A few random selections</p>
<p>Find by category (a lot of them, but just list them and that's it...)</p>
<p>Want to upload yours? Or review others? <a href="/register">Register!</a></p> -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchData, type Data, type Problem, type Category } from '$services/dataService';
	import { Card } from 'flowbite-svelte';

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

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-semibold mb-4">Problems</h1>
		{#each Object.entries(data.problems) as [id, problem]}
			<Card class="mb-4 w-full">
				<div class="flex flex-col md:flex-row">
					{#if problem.problemImage}
						<div class="md:w-1/3 p-2">
							<img src={problem.problemImage} alt="Problem " class="w-full h-auto object-cover" />
						</div>
					{/if}
					<div class="md:w-2/3 p-4">
						<h2 class="text-xl font-bold mb-2">{id}</h2>
						{#if problem.problemText}
							<p class="mb-2">{problem.problemText}</p>
						{/if}
						{#if problem.answerText}
							<p class="mb-2"><strong>Answer:</strong> {problem.answerText}</p>
						{/if}
						{#if problem.answerImage}
							<img
								src={problem.answerImage}
								alt="Answer "
								class="w-full h-auto object-cover my-2"
							/>
						{/if}
						<p class="text-gray-500">Category: {data.categories[problem.categoryId]?.name}</p>
						<p class="text-gray-500">
							Created On: {new Date(problem.createdOn).toLocaleDateString()}
						</p>
					</div>
				</div>
			</Card>
		{/each}
	</div>
{/if}
