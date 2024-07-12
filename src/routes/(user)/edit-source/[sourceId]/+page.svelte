<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import { CloseOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { approvalApi, publicApi } from '$services/apiService';
	import type { ProblemDisplayViewDto, Source, SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import type { Components } from '../../../../types';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';

	let sourceId: string;
	$: sourceId = get(page).params.sourceId;

	let isSourceDataChanged = false;
	$: {
		isSourceDataChanged =
			oldSourceData?.name !== sourceData?.name ||
			oldSourceData?.description !== sourceData?.description;
	}

	let oldSourceData: Source;
	let oldProblems: ProblemDisplayViewDto[] = [];

	onMount(async () => {
		const sourceResponse = await publicApi.getSourceById1(sourceId);
		oldSourceData = sourceResponse.data;
		sourceData = {
			name: oldSourceData.name,
			description: oldSourceData.description
		};

		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		oldProblems = problemsResponse.data;
	});

	let isProblemSubmitted = [false];

	let sourceData: SourceSubmitDto = {
		name: '',
		description: ''
	};

	let problems: Components.ProblemCreateFormData[] = [];

	async function updateSource() {
		await approvalApi.update(sourceId, sourceData);
		successStore.set('Šaltinis sėkmingai pakeistas');
		const sourceResponse = await publicApi.getSourceById1(sourceId);
		oldSourceData = sourceResponse.data;
	}

	async function submitProblem(index: number) {
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
		problems = problems.filter((_, i) => i !== index);
		isProblemSubmitted = isProblemSubmitted.filter((_, i) => i !== index);
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		oldProblems = problemsResponse.data;
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

	async function deleteProblem(problemId: string) {
		await approvalApi.deleteProblem1(problemId);
		successStore.set('Užduotis ištrinta sėkmingai');
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		oldProblems = problemsResponse.data;
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio redagavimas</h1>
<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit-dashboard')} class="w-16">Grįžti</Button>
	</div>
	<div>
		<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>
		<h3 class="text-lg text-blue-600 text-center">Užduotis galite rūšiuoti į kategorijas!</h3>
	</div>

	<div class="w-28">
		<Button color="blue" on:click={() => goto('/sort-dashboard')} class="w-28">Rūšiuoti</Button>
	</div>
</div>
<p class="text-justify mx-4 my-4">
	Spausdami mygtukus "Pateikti pakeitimą peržiūrai" Jūs patvirtinate, kad įkeliate tik savo sukurtas
	originalias užduotis arba užduotis, kurios jau yra pasiekiamos viešai. Pateikdami savo užduotis
	atsisakote turtinių autorinių teisių į šias užduotis, leidžiate užduotimis naudotis bet kam.
	Pateikdami kitų autorių užduotis patvirtinate, kad tie autoriai yra atsisakę turtinių autorinių
	teisių bei taip pat leidžia naudotis užduotimis bet kam. Peržiūrėtos ir patvirtintos užduotys bus
	paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu.
</p>

<div class="relative">
	<SourceCreateForm bind:sourceData />
	<Button
		disabled={!isSourceDataChanged}
		color="yellow"
		on:click={updateSource}
		class="w-fit absolute right-2 bottom-2">Pateikti pakeitimą peržiūrai</Button
	>
</div>

<div class="container mx-auto">
	{#each oldProblems as problem}
		<div class="relative my-3 p-4 border rounded-md">
			<Button
				color="red"
				on:click={() => deleteProblem(problem.id)}
				class="absolute top-8 right-20 z-10"
			>
				Ištrinti
			</Button>
			<ProblemComponent
				problemMainData={{
					skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
					problemText: problem.problemText,
					problemImageSrc: problem.problemImageSrc,
					answerText: problem.answerText,
					answerImageSrc: problem.answerImageSrc,
					categoryId: problem.categoryId,
					sourceId: problem.sourceId
				}}
			/>
		</div>
	{/each}
</div>

<p class="text-center mb-4">
	Darydami ekrano nuotraukas rinkitės kiek įmanoma didesnį mastelį, kad būtų geresnė kokybė
</p>

{#each problems as problem, i}
	<div class="relative">
		<Button
			color="primary"
			on:click={() => removeProblem(i)}
			class="w-fit h-10 absolute right-2 top-2"><CloseOutline /></Button
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
