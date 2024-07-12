<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Components } from '../../../types';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { approvalApi } from '$services/apiService';
	import type { SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';

	let sourceId: string | null = null;
	let isSourceSubmitted = false;
	let isProblemSubmitted = [false];

	let sourceData: SourceSubmitDto = {
		name: '',
		description: ''
	};

	let problems: Components.ProblemCreateFormData[] = [
		{
			problemText: '',
			problemImageFile: null,
			problemImageUrl: '',
			answerText: '',
			answerImageFile: null,
			answerImageUrl: ''
		}
	];

	async function submitSource() {
		console.log(sourceData, problems);
		const idResponse = await approvalApi.submitSourceData(sourceData);
		isSourceSubmitted = true;
		sourceId = idResponse.data.id;
		successStore.set('Šaltinis pateiktas sėkmingai');
	}

	async function submitProblem(index: number) {
		if (!sourceId) {
			alert('Pirma pateikite šaltinį');
			return;
		}
		await approvalApi.submitProblem(
			sourceId,
			{
				problemText: problems[index].problemText,
				problemImageUrl: problems[index].problemImageUrl,
				answerText: problems[index].answerText,
				answerImageUrl: problems[index].answerImageUrl
			},
			problems[index].problemImageFile!!,
			problems[index].answerImageFile!!
		);
		isProblemSubmitted[index] = true;
		successStore.set('Užduotis pateikta sėkmingai');
	}

	function addProblem() {
		problems = [
			...problems,
			{
				problemText: '',
				problemImageFile: null,
				problemImageUrl: '',
				answerText: '',
				answerImageFile: null,
				answerImageUrl: ''
			}
		];
		isProblemSubmitted = [...isProblemSubmitted, false];
	}

	function removeProblem(index: number) {
		problems = problems.filter((_, i) => i !== index);
		isProblemSubmitted = isProblemSubmitted.filter((_, i) => i !== index);
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio įkėlimas</h1>
<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit-dashboard')} class="w-16">Grįžti</Button>
	</div>
	<div>
		<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>
		<h3 class="text-lg text-blue-600 text-center">
			Vos pateikę užduotis galite jas rūšiuoti į kategorijas!
		</h3>
	</div>

	<div class="w-28">
		<Button color="blue" on:click={() => goto('/sort-dashboard')} class="w-28">Rūšiuoti</Button>
	</div>
</div>
<p class="text-justify mx-4 my-4">
	Spausdami mygtukus "Pateikti peržiūrai" Jūs patvirtinate, kad įkeliate tik savo sukurtas
	originalias užduotis arba užduotis, kurios jau yra pasiekiamos viešai. Pateikdami savo užduotis
	atsisakote turtinių autorinių teisių į šias užduotis, leidžiate užduotimis naudotis bet kam.
	Pateikdami kitų autorių užduotis patvirtinate, kad tie autoriai yra atsisakę turtinių autorinių
	teisių bei taip pat leidžia naudotis užduotimis bet kam. Peržiūrėtos ir patvirtintos užduotys bus
	paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu.
</p>

<div class="relative">
	<SourceCreateForm {sourceData} />
	<Button
		disabled={isSourceSubmitted}
		color="purple"
		on:click={submitSource}
		class="w-fit absolute right-2 bottom-2">Pateikti peržiūrai</Button
	>
</div>

<p class="text-center mb-4">
	Darydami ekrano nuotraukas rinkitės kiek įmanoma didesnį mastelį, kad būtų geresnė kokybė
</p>

{#each problems as problem, i}
	<div class="relative">
		<Button color="red" on:click={() => removeProblem(i)} class="w-10 h-10 absolute right-2 top-2"
			><TrashBinSolid /></Button
		>
		<ProblemCreateForm problemData={problem} index={i} />
		<Button
			disabled={isProblemSubmitted[i]}
			color="purple"
			on:click={() => submitProblem(i)}
			class="w-fit absolute right-2 bottom-2">Pateikti peržiūrai</Button
		>
	</div>
{/each}

<Button color="green" on:click={addProblem} class="w-full"><PlusOutline /></Button>
