<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Problem, ProblemPostDto } from '$services/gen-client';
	import { problemApi } from '$services/apiService';
	import { Button } from 'flowbite-svelte';

	let problems = writable<Problem[]>([]);
	let newProblem: ProblemPostDto = {
		skfCode: '',
		problemImagePath: '',
		answerImagePath: '',
		problemText: '',
		answerText: '',
		categoryId: '',
		sourceId: ''
	};
	let editProblem: Problem | null = null;
	let errorMessage = '';

	const fetchProblems = async () => {
		try {
			const response = await problemApi.getAllProblems();
			problems.set(response.data);
		} catch (error) {
			errorMessage = 'Failed to fetch problems';
			console.error(error);
		}
	};

	const createProblem = async () => {
		try {
			await problemApi.createProblem(newProblem);
			newProblem = {
				skfCode: '',
				problemImagePath: '',
				answerImagePath: '',
				problemText: '',
				answerText: '',
				categoryId: '',
				sourceId: ''
			};
			fetchProblems();
		} catch (error) {
			errorMessage = 'Failed to create problem';
			console.error(error);
		}
	};

	const updateProblem = async () => {
		try {
			if (editProblem) {
				await problemApi.updateProblem(editProblem.id, editProblem);
				editProblem = null;
				fetchProblems();
			}
		} catch (error) {
			errorMessage = 'Failed to update problem';
			console.error(error);
		}
	};

	const deleteProblem = async (id: string) => {
		try {
			await problemApi.deleteProblem(id);
			fetchProblems();
		} catch (error) {
			errorMessage = 'Failed to delete problem';
			console.error(error);
		}
	};

	const initMeta = async () => {
		try {
			await problemApi.initMeta();
			alert('Succ');
		} catch (error) {
			errorMessage = 'Failed to set meta';
			console.error(error);
		}
	};

	onMount(fetchProblems);
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Manage firestore problems</h1>

{#if errorMessage}
	<div class="bg-red-500 text-white p-4 rounded">
		{errorMessage}
	</div>
{/if}

<Button on:click={initMeta} class="bg-blue-500 text-white px-4 py-2 rounded"
	>Set SKF-0 to the meta repo</Button
>

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Problems</h2>
	{#each $problems as problem (problem.id)}
		<div class="p-4 bg-white rounded shadow mb-4">
			{#if editProblem && editProblem.id === problem.id}
				<form on:submit|preventDefault={updateProblem}>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700" for="skfcode">SKF code</label>
						<input
							id="skfcode"
							type="text"
							bind:value={editProblem.skfCode}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="problemText" class="block text-sm font-medium text-gray-700"
							>Problem Text</label
						>
						<textarea
							id="problemText"
							bind:value={editProblem.problemText}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						></textarea>
					</div>
					<div class="mb-4">
						<label for="problemImagePath" class="block text-sm font-medium text-gray-700"
							>Problem Image Path</label
						>
						<input
							id="problemImagePath"
							type="text"
							bind:value={editProblem.problemImagePath}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="answerText" class="block text-sm font-medium text-gray-700"
							>Answer Text</label
						>
						<textarea
							id="answerText"
							bind:value={editProblem.answerText}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						></textarea>
					</div>
					<div class="mb-4">
						<label for="answerImagePath" class="block text-sm font-medium text-gray-700"
							>Answer Image Path</label
						>
						<input
							id="answerImagePath"
							type="text"
							bind:value={editProblem.answerImagePath}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="categoryId" class="block text-sm font-medium text-gray-700"
							>Category ID</label
						>
						<input
							id="categoryId"
							type="text"
							bind:value={editProblem.categoryId}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="sourceId" class="block text-sm font-medium text-gray-700">Source ID</label>
						<input
							id="sourceId"
							type="text"
							bind:value={editProblem.sourceId}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
					<button
						type="button"
						on:click={() => (editProblem = null)}
						class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button
					>
				</form>
			{:else}
				<div class="flex justify-between items-center">
					<div>
						<h3 class="text-lg font-semibold">{problem.id}</h3>
						<p class="text-gray-600"><strong>skfCode: </strong>{problem.skfCode}</p>
						<p class="text-gray-600"><strong>problemText: </strong>{problem.problemText}</p>
						<p class="text-gray-600">
							<strong>problemImagePath: </strong>{problem.problemImagePath}
						</p>
						<p class="text-gray-600"><strong>answerText: </strong>{problem.answerText}</p>
						<p class="text-gray-600"><strong>answerImagePath: </strong>{problem.answerImagePath}</p>
						<p class="text-gray-600"><strong>categoryId: </strong>{problem.categoryId}</p>
						<p class="text-gray-600"><strong>sourceId: </strong>{problem.sourceId}</p>
					</div>
					<div>
						<button
							on:click={() => (editProblem = { ...problem })}
							class="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button
						>
						<button
							on:click={() => deleteProblem(problem.id)}
							class="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button
						>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Create Problem</h2>
	<form on:submit|preventDefault={createProblem}>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="skfcode">SKF code</label>
			<input
				id="skfcode"
				type="text"
				bind:value={newProblem.skfCode}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="problemtext">Problem Text</label>
			<textarea
				id="problemtext"
				bind:value={newProblem.problemText}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			></textarea>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="problemimage"
				>Problem Image Path</label
			>
			<input
				id="problemimage"
				type="text"
				bind:value={newProblem.problemImagePath}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="answertext">Answer Text</label>
			<textarea
				id="answertext"
				bind:value={newProblem.answerText}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			></textarea>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="answerimage"
				>Answer Image Path</label
			>
			<input
				id="answerimage"
				type="text"
				bind:value={newProblem.answerImagePath}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="categoryid">Category ID</label>
			<input
				id="categoryid"
				type="text"
				bind:value={newProblem.categoryId}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="sourceid">Source ID</label>
			<input
				id="sourceid"
				type="text"
				bind:value={newProblem.sourceId}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
	</form>
</div>
