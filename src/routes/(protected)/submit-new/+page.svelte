<script lang="ts">
	import { currentUser } from '$lib/stores';
	import ProblemCreate from '$components/forms/ProblemCreate.svelte';
	import { Button } from 'flowbite-svelte';
	import CategoryCreate from '$components/forms/CategoryCreate.svelte';
	import { writable, type Writable } from 'svelte/store';
	import {
		postCategoryWithProblemsFull,
		type CategoryForDatabase,
		type ProblemFullWithFiles
	} from '$services/dataService';
	import { goto } from '$app/navigation';
	import { generateGUID } from '$utils/helpers';

	let category: Writable<CategoryForDatabase> = writable({} as CategoryForDatabase);
	let problemsFullWithFiles: Writable<Writable<ProblemFullWithFiles>[]> = writable([]);

	function addProblem() {
		const newProblem: ProblemFullWithFiles = {
			id: 'SKF-..',
			problemText: '',
			answerText: '',
			categoryId: '',
			createdOn: '',
			problemImageFile: null,
			answerImageFile: null
		};
		problemsFullWithFiles.update((problems) => [...problems, writable(newProblem)]);
	}

	const submitCategoryWithProblems = () => {
		if (!$currentUser) {
			alert('Unauthorized');
			return;
		}
		const randomUUID = generateGUID();
		category.update((c) => {
			c.id = randomUUID;
			c.createdBy = $currentUser.username;
			c.createdOn = new Date().toISOString();
			return c;
		});
		problemsFullWithFiles.update((p) => {
			return p.map((problem) => {
				problem.update((p) => {
					p.categoryId = randomUUID;
					p.createdOn = new Date().toISOString();
					return p;
				});
				return problem;
			});
		});

		postCategoryWithProblemsFull($category, $problemsFullWithFiles)
			.then(() => {
				alert('Category with problems submitted for review');
				goto('/submit-dashboard');
			})
			.catch((e) => {
				alert('Error: ' + e.message);
			});
	};
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Įkelti savo užduotis</h1>
	<p class="text-red-600 text-center">Changes are not saved automatically!</p>
	<Button
		on:click={() => {
			if (confirm('Are you sure you want to go back? All changes will be lost.')) {
				goto('/submit-dashboard');
			}
		}}
		class="ml-4">Go back</Button
	>

	<form class="text-center" on:submit|preventDefault={() => submitCategoryWithProblems()}>
		<CategoryCreate {category} />
		{#each $problemsFullWithFiles as problem, index}
			<ProblemCreate bind:problemData={problem} />
		{/each}
		<Button color="green" class="my-4" on:click={() => addProblem()}>Add a problem</Button>
		<div class="mx-auto mt-8 w-3/4">
			<p class="text-justify">
				By clicking "Submit for review" you confirm that you upload only original problems, created
				by you (which will wave your copyright rights and make it royalty-free) or problems that are
				already royalty-free. It will be reviewed by admins and if it's approved, it will be public
				for everyone to see and use (together with your username, but not email).
			</p>
			<Button class="my-4" type="submit">Submit for review</Button>
		</div>
	</form>
{:else}
	<p>Unauthorized</p>
{/if}
