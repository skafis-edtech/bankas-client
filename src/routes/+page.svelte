<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../types';
	import { Alert, Button, TabItem, Tabs } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { viewApi } from '$services/apiService';

	const { user } = getContext('authContext') as AuthContext;

	let numOfProblems: number | null = null;

	onMount(async () => {
		const problemsCountRes = await viewApi.getStats();
		numOfProblems = problemsCountRes.data.problemCount;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Skafis užduočių bankas</h1>
<h4 class="text-md font-semibold my-4 text-center">
	Užduočių: {numOfProblems || '...'}
</h4>
<h5 class="text-md font-semibold my-4 text-center">
	Mokytojų pasidalintos originalios bei kitų šaltinių užduotys. Plačiau puslapyje <a
		class="text-blue-800 underline"
		href="/about">"Apie"</a
	>
</h5>

<Alert color="red" class="my-4 text-center">
	<h5>
		Labai reikalingas visapusiškas grįžtamasis ryšys! Lauksiu <a href="mailto:info@skafis.lt"
			>info@skafis.lt</a
		> arba bet kur kitur.
	</h5>
</Alert>

<div class="flex flex-row justify-end">
	<Button
		color="blue"
		on:click={() => {
			goto('/list');
		}}>Atrinktų sąrašas ir PDF generavimas</Button
	>
</div>
