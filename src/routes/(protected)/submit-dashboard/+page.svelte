<!-- <script lang="ts">
	import { ROLES } from '$utils/constants';
	import ProblemSubmitted from '$components/ui/ProblemSubmitted.svelte';
	import { currentUser } from '$lib/stores';
</script>

{#if $currentUser}
	<h1>Submit Dashboard</h1>
	<p>Welcome, {$currentUser.username}</p>
	{#if $currentUser.role !== ROLES.ADMIN}
		<p>
			Want to review others? Email <a href="mailto:naglis.suliokas@gmail.com"
				>naglis.suliokas@gmail.com</a
			> to get access!
		</p>
	{/if}
	<p>Under review</p>
	<p>Approved</p>
	<ProblemSubmitted />
	<p>Upload new. <a href="/submit-new">Submit new</a></p>
{:else}
	<p>Unauthorized</p>
{/if}

<style lang="scss">
	h1 {
		margin-top: 0;
		font-size: 1.5rem;
	}
</style> -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { categoryApi, problemApi, testApi } from '$services/apiService'; // Adjust the import path
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';

	let categories: Category[] = [];
	let problems: ProblemDisplayViewDto[] = [];
	let userId = '';

	// Fetch all categories on component mount
	onMount(async () => {
		try {
			const categoryResponse = await categoryApi.getAllPublicCategories();
			categories = categoryResponse.data;

			// Fetch problems for the first category as an example
			if (categories.length > 0) {
				const problemResponse = await problemApi.getPublicProblemsByCategory(categories[0].id);
				problems = problemResponse.data;
			}

			// Test API to get user ID
			const userIdResponse = await testApi.test();
			userId = userIdResponse.data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});
</script>

<main>
	<h1>Categories</h1>
	<ul>
		{#each categories as category}
			<li>{category.name} - {category.description}</li>
		{/each}
	</ul>

	<h1>Problems</h1>
	<ul>
		{#each problems as problem}
			<li>{problem.problemText}</li>
		{/each}
	</ul>

	<h1>User ID</h1>
	<p>{userId}</p>

	<a href="/submit-new-category">New caytegory</a>
	<a href="/submit-new-problem">New problem</a>
</main>
