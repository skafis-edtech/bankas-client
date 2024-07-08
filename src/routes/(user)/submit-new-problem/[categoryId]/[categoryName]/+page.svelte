<script lang="ts">
	import ProblemCreate from '$components/forms/ProblemCreate.svelte';
	import { Button } from 'flowbite-svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ProblemPostDto, ProblemPostDtoOld } from '$services/gen-client';
	import { problemApi, problemOldApi } from '$services/apiService';

	let categoryId: string;
	$: categoryId = get(page).params.categoryId;
	let categoryName: string;
	$: categoryName = get(page).params.categoryName;

	let problemData: Writable<ProblemPostDtoOld> = writable({
		problemText: '',
		answerText: '',
		categoryId: '',
		problemImageUrl: '',
		answerImageUrl: '',
		sourceId: ''
	});
	let problemImageFile: Writable<File | null> = writable(null);
	let answerImageFile: Writable<File | null> = writable(null);

	let loading = false;
	let error = '';

	async function submitProblem() {
		const data = $problemData;
		data.categoryId = categoryId;
		const problemImage = $problemImageFile;
		const answerImage = $answerImageFile;
		console.log(data);
		console.log(problemImage);
		console.log(answerImage);

		loading = true;
		try {
			// This is sketchy... Should be tested, but idk, I'm lazy... WOW SOME COMPLEX STUFF WITH MULTPART_FORM_DATA
			const response = await problemOldApi.submitProblem(
				data,
				problemImage ? problemImage : undefined,
				answerImage ? answerImage : undefined
			);
			alert('Problem submitted, id:' + response.data.id);
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių įkėlimas</h1>
<h1 class="text-2xl font-semibold my-4 text-center">Kategorija: {categoryName}</h1>
<p class="text-justify">
	By clicking "Submit for review" you confirm that you upload only original problems, created by you
	(which will wave your copyright rights and make it royalty-free) or problems that are already
	royalty-free. It will be reviewed by admins and if it's approved, it will be public for everyone
	to see and use (together with your username, but not email).
</p>

<Button on:click={() => goto('/submit-dashboard')} class="ml-4">Grįžti</Button>
<ProblemCreate bind:problemData bind:problemImageFile bind:answerImageFile />
<Button on:click={() => submitProblem()}>Submit problem</Button>
{#if loading}
	<p class="text-center">Keliama...</p>
{/if}
{#if error}
	<p class="text-red-600 text-center">Klaida: {error}</p>
{/if}
