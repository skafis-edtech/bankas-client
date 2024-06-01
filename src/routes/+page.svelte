<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchData, type Data, type Problem, type Category } from '$services/dataService';
	import { Button, Card, Input } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

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

	let skfCode = writable('SKF-');
</script>

<div class="flex flex-col my-8">
	<h1 class="text-2xl font-semibold text-center">Unikalus kodas</h1>
	<p class="text-center">Įveskite unikalų užduoties SKF kodą (skaičius)</p>
	<form on:submit|preventDefault={() => {}} class="flex flex-col mb-8">
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
	<div class="text-center">One problem...</div>
</div>
<div>
	<h1 class="text-2xl font-semibold mb-4 text-center">Kategorijos</h1>
	<p>Want to upload yours? Or review others? <a href="/register">Register!</a></p>
</div>
{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-semibold mb-4">Problems</h1>
		{#each Object.entries(data.problems) as [id, problem]}
			<Card class="mb-4 w-full">
				<div class="flex flex-col">
					{#if problem.problemImage}
						<div class=" p-2">
							<img src={problem.problemImage} alt="Problem" class="w-full h-auto object-cover" />
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
