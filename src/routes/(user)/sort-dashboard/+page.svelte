<script lang="ts">
	import { publicApi, sortApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../../types';
	import ClickableProblem from '$components/ui/ClickableProblem.svelte';
	import { ROLES } from '$utils/constants';
	import { successStore } from '$lib/stores';
	const { user } = getContext('authContext') as AuthContext;

	let categories: Category[] = [];

	enum ProblemShadeColor {
		TRANSPARENT = 'transparent',
		GREEN = 'bg-green-500',
		GRAY = 'bg-gray-500',
		RED = 'bg-red-500'
	}

	interface ProblemWithShadeColor {
		problem: ProblemDisplayViewDto;
		shadeColor: ProblemShadeColor;
	}

	let allProblems: ProblemWithShadeColor[] = [];
	let isMySortedLoaded = false;
	let isNotMyUnsortedLoaded = false;
	let isNotMySortedLoaded = false;

	let selectedProblemId: string;
	let skippedProblemIdsCache: string[] = [];

	onMount(async () => {
		const [categoriesRes, problemsRes] = await Promise.all([
			publicApi.getCategories(),
			sortApi.getUnsortedProblems()
		]);

		categories = categoriesRes.data;
		allProblems = problemsRes.data.map((problem) => ({
			problem,
			shadeColor: ProblemShadeColor.TRANSPARENT
		}));
		if (allProblems.length > 0) {
			selectedProblemId = allProblems[0].problem.id;
		} else {
			selectedProblemId = '';
		}
	});

	async function loadMySortedProblems() {
		if (isMySortedLoaded) {
			return;
		}
		const res = await sortApi.getSortedProblems();
		allProblems = [
			...allProblems,
			...res.data
				.filter((problem) => !skippedProblemIdsCache.includes(problem.id))
				.map((problem) => ({ problem, shadeColor: ProblemShadeColor.GREEN }))
		];
		isMySortedLoaded = true;
		if (allProblems.length > 0) {
			selectedProblemId = allProblems[0].problem.id;
		} else {
			selectedProblemId = '';
		}
	}

	async function loadNotMyUnsortedProblems() {
		if (isNotMyUnsortedLoaded) {
			return;
		}
		const res = await sortApi.getNotMyUnsortedProblems();
		allProblems = [
			...allProblems,
			...res.data
				.filter((problem) => !skippedProblemIdsCache.includes(problem.id))
				.map((problem) => ({ problem, shadeColor: ProblemShadeColor.GRAY }))
		];
		isNotMyUnsortedLoaded = true;
		if (allProblems.length > 0) {
			selectedProblemId = allProblems[0].problem.id;
		} else {
			selectedProblemId = '';
		}
	}

	async function loadNotMySortedProblems() {
		if (isNotMySortedLoaded) {
			return;
		}
		const res = await sortApi.getNotMySortedProblems();
		allProblems = [
			...allProblems,
			...res.data
				.filter((problem) => !skippedProblemIdsCache.includes(problem.id))
				.map((problem) => ({ problem, shadeColor: ProblemShadeColor.RED }))
		];
		isNotMySortedLoaded = true;
		if (allProblems.length > 0) {
			selectedProblemId = allProblems[0].problem.id;
		} else {
			selectedProblemId = '';
		}
	}

	async function sortProblem(categoryId: string) {
		await sortApi.sortProblem(selectedProblemId, categoryId);
		successStore.set('Užduotis sėkmingai surūšiuota');
		skipProblem();
	}

	function skipProblem() {
		allProblems = allProblems.filter((p) => p.problem.id !== selectedProblemId);
		if (allProblems.length > 0) {
			selectedProblemId = allProblems[0].problem.id;
		} else {
			selectedProblemId = '';
		}
		skippedProblemIdsCache = [...skippedProblemIdsCache, selectedProblemId];
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rūšiavimas</h1>
<h3 class="text-lg text-green-500 text-center">Rūšiavimas išsisaugo automatiškai</h3>

<div class=" flex fixed bottom-4 z-10 gap-4 flex-wrap bg-black p-4 rounded-md">
	{#each categories as category}
		<Button
			color={allProblems.find((p) => p.problem.id === selectedProblemId)?.problem.categoryId ===
			category.id
				? 'blue'
				: 'light'}
			on:click={() => sortProblem(category.id)}
			>{category.name}
		</Button>
	{/each}
	<Button on:click={skipProblem}>PRALEISTI</Button>
</div>

<div>
	{#each allProblems as { problem, shadeColor }}
		<ClickableProblem
			{problem}
			shadeColorStr={shadeColor}
			isClicked={selectedProblemId === problem.id}
			onClick={() => {
				selectedProblemId = problem.id;
			}}
		/>
	{/each}
</div>

<div class="flex flex-col w-fit gap-4 float-right mt-32">
	{#if !isMySortedLoaded}
		<Button on:click={loadMySortedProblems} color="green">Rodyti mano surūšiuotas užduotis</Button>
	{/if}
	{#if !isNotMyUnsortedLoaded && $user && [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes($user.role)}
		<Button on:click={loadNotMyUnsortedProblems} color="light"
			>Rodyti KITŲ nesurūšiuotas užduotis</Button
		>
	{/if}
	{#if !isNotMySortedLoaded && $user && [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes($user.role)}
		<Button on:click={loadNotMySortedProblems} color="red">Rodyti KITŲ surūšiuotas užduotis</Button>
	{/if}
</div>
