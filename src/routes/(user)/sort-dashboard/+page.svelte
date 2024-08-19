<script lang="ts">
	import { publicApi, sortApi } from '$services/apiService';
	import type { Category, ProblemDisplayViewDto } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../../types';
	import { ROLES } from '$utils/constants';
	import ChooseCategories from '$components/ui/sort-dashboard/ChooseCategories.svelte';
	import ClickableProblem from '../../../components/ui/sort-dashboard/ClickableProblem.svelte';
	import { goto } from '$app/navigation';
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
		/* STAGE 1 - For now not accessible to users */
		goto('/');
		/* ... */

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

<ChooseCategories
	{categories}
	currentProblemCategories={allProblems.find((p) => p.problem.id === selectedProblemId)?.problem
		.categories || []}
	{skipProblem}
	currentProblemId={selectedProblemId}
/>
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
