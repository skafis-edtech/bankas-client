<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Components } from '../../../types';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import { CloseOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { approvalApi } from '$services/apiService';
	import type { ProblemDisplayViewDto, SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';

	let sourceId: string | null = null;
	let isSourceSubmitted = false;
	let isProblemSubmitted = [false];

	let submittedSource: SourceSubmitDto;
	let submittedProblems: ProblemDisplayViewDto[] = [];

	let isSourceDataChanged = false;
	$: {
		isSourceDataChanged =
			submittedSource?.name !== sourceData?.name ||
			submittedSource?.description !== sourceData?.description;
	}

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
		submittedSource = {
			name: sourceData.name,
			description: sourceData.description
		};
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
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		submittedProblems = problemsResponse.data;
		problems = problems.filter((_, i) => i !== index);
		isProblemSubmitted = isProblemSubmitted.filter((_, i) => i !== index);
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

	function updateSource() {
		approvalApi.update(sourceId!!, sourceData);
		successStore.set('Šaltinis sėkmingai pakeistas');
		submittedSource = {
			name: sourceData.name,
			description: sourceData.description
		};
	}

	async function deleteProblem(problemId: string) {
		await approvalApi.deleteProblem1(problemId);
		successStore.set('Užduotis ištrinta sėkmingai');
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId!!);
		submittedProblems = problemsResponse.data;
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
	Spausdami mygtukus "Pateikti peržiūrai" arba "Pateikti pakeitimą peržiūrai" Jūs patvirtinate, kad
	įkeliate tik savo sukurtas originalias užduotis arba užduotis, kurios jau yra pasiekiamos viešai.
	Pateikdami savo užduotis atsisakote turtinių autorinių teisių į šias užduotis, leidžiate
	užduotimis naudotis bet kam. Pateikdami kitų autorių užduotis patvirtinate, kad tie autoriai yra
	atsisakę turtinių autorinių teisių bei taip pat leidžia naudotis užduotimis bet kam. Peržiūrėtos
	ir patvirtintos užduotys bus paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu.
</p>

<div class="relative">
	<SourceCreateForm bind:sourceData />
	{#if isSourceSubmitted}
		<Button
			disabled={!isSourceDataChanged}
			color="yellow"
			on:click={updateSource}
			class="w-fit absolute right-2 bottom-2">Pateikti pakeitimą peržiūrai</Button
		>
	{:else}
		<Button color="purple" on:click={submitSource} class="w-fit absolute right-2 bottom-2"
			>Pateikti peržiūrai</Button
		>
	{/if}
</div>

<div class="container mx-auto">
	{#each submittedProblems as problem}
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

<p class="text-center mb-2">
	Darydami ekrano nuotraukas rinkitės kiek įmanoma didesnį mastelį, kad būtų geresnė kokybė. (Galite
	naudotis Win+Shift+S komanda ir tuomet įklijuoti naudojantis Ctrl+V)
</p>
<p class="text-center mb-4">
	Formules galite generuoti čia, naudojantis LaTex sintakse (nukopijuokite paveikslėlio nuorodą arba
	nutempkite paveikslėlį): <a href="https://latex.codecogs.com/eqneditor/editor.php" target="_blank"
		>https://latex.codecogs.com/eqneditor/editor.php</a
	>
</p>

{#each problems as problem, i}
	<div class="relative">
		<Button
			color="primary"
			on:click={() => removeProblem(i)}
			class="w-10 h-10 absolute right-2 top-2"><CloseOutline /></Button
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
