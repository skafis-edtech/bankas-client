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

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio (šaltinio) įkėlimas</h1>
<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>
<p class="text-justify">
	Spausdami mygtuką "Pateikti peržiūrai" Jūs patvirtinate, kad įkeliate tik Jūsų sukurtas
	originalias užduotis arba užduotis, kurios jau yra pasiekiamos viešai. Pateikdami savo užduotis
	atsisakote turtinių autorinių teisių į šias užduotis, leidžiate užduotimis naudotis bet kam.
	Pateikdami kitų autorių užduotis patvirtinate, kad tie autoriai yra atsisakę turtinių autorinių
	teisių bei taip pat leidžia naudotis užduotimis bet kam. Peržiūrėtos ir patvirtintos užduotys bus
	paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu.
</p>

<Button
	on:click={() => {
		if (confirm('Duomenys nebus išsaugoti. Ar tikrai norite grįžti?')) {
			goto('/submit-dashboard');
		}
	}}
	class="ml-4">Grįžti</Button
>
<ProblemCreate bind:problemData bind:problemImageFile bind:answerImageFile />
<Button on:click={() => submitProblem()}>Submit problem</Button>
{#if loading}
	<p class="text-center">Keliama...</p>
{/if}
{#if error}
	<p class="text-red-600 text-center">Klaida: {error}</p>
{/if}
