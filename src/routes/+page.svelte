<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FindById from '$components/layout/FindById.svelte';
	import type { Category } from '$services/gen-client';
	import { categoryOldApi, problemOldApi } from '$services/apiService';
	import CategoryWithProblems from '$components/layout/CategoryWithProblems.svelte';
	import { Alert } from 'flowbite-svelte';
	import type { AuthContext } from '../types';

	const { user } = getContext('authContext') as AuthContext;

	let categories: Category[] = [];
	let numOfProblems: number | null = null;
	let numOfCategories: number | null = null;

	onMount(async () => {
		const [categoriesRes, problemsCountRes, categoriesCountRes] = await Promise.all([
			categoryOldApi.getAllPublicCategories(),
			problemOldApi.getPublicProblemsCount(),
			categoryOldApi.getPublicCategoriesCount()
		]);

		categories = categoriesRes.data;
		numOfProblems = problemsCountRes.data.count;
		numOfCategories = categoriesCountRes.data.count;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>

<h3 class="text-md font-semibold my-4 text-center">
	Mokytojų pasidalintos originalios užduotys surūšiuotos į temas (kategorijas)
</h3>

<h3 class="text-md font-semibold my-4 text-center">
	Užduočių: {numOfProblems || '...'} | Kategorijų: {numOfCategories || '...'}
</h3>

<div class="my-8">
	<hr class="border-y-1 border-black" />
</div>
<FindById />
<div class="my-8">
	<hr class="border-y-1 border-black" />
</div>

<div class="text-center">
	<h1 class="text-2xl font-semibold my-6">Kategorijos</h1>
	{#if !$user}
		<p>
			Norite įkelti savo užduotis ar patvirtinti pateiktas kitų? <a
				class="text-blue-800 underline"
				href="/register">Registruokitės!</a
			>
		</p>
	{/if}
</div>

{#each Object.entries(categories) as [id, category]}
	<CategoryWithProblems {category} />
{/each}
