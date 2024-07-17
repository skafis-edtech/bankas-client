<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import { CloseOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { approvalApi, publicApi } from '$services/apiService';
	import type { ProblemDisplayViewDto, Source, SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import type { Components } from '../../../../../types';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';

	let sourceId: string;
	$: sourceId = get(page).params.sourceId;

	let oldSourceData: Source;
	let submittedProblems: ProblemDisplayViewDto[] = [];

	let sourceData: SourceSubmitDto = {
		name: '',
		description: ''
	};
	let newProblem: Components.ProblemCreateFormData = {
		sourceListNr: 0,
		problemText: '',
		problemImageFile: null,
		problemImageUrl: '',
		answerText: '',
		answerImageFile: null,
		answerImageUrl: ''
	};

	let isSourceDataChanged = false;
	$: {
		isSourceDataChanged =
			oldSourceData?.name !== sourceData?.name ||
			oldSourceData?.description !== sourceData?.description;
	}

	onMount(async () => {
		const sourceResponse = await publicApi.getSourceById1(sourceId);
		oldSourceData = sourceResponse.data;
		sourceData = {
			name: oldSourceData.name,
			description: oldSourceData.description
		};

		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		submittedProblems = problemsResponse.data;

		const nextSourceListNr = submittedProblems[submittedProblems.length - 1]?.sourceListNr + 1 || 1;

		newProblem = {
			sourceListNr: nextSourceListNr,
			problemText: '',
			problemImageFile: null,
			problemImageUrl: '',
			answerText: '',
			answerImageFile: null,
			answerImageUrl: ''
		};
	});

	async function updateSource() {
		await approvalApi.update(sourceId, sourceData);
		successStore.set('Šaltinis sėkmingai pakeistas');
		const sourceResponse = await publicApi.getSourceById1(sourceId);
		oldSourceData = sourceResponse.data;
	}

	async function submitProblem() {
		await approvalApi.submitProblem(
			sourceId,
			{
				sourceListNr: newProblem.sourceListNr,
				problemText: newProblem.problemText,
				problemImageUrl: newProblem.problemImageUrl,
				answerText: newProblem.answerText,
				answerImageUrl: newProblem.answerImageUrl
			},
			newProblem.problemImageFile!!,
			newProblem.answerImageFile!!
		);
		successStore.set('Užduotis pateikta sėkmingai');
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		submittedProblems = problemsResponse.data;

		const nextSourceListNr = submittedProblems[submittedProblems.length - 1].sourceListNr + 1;

		newProblem = {
			sourceListNr: nextSourceListNr,
			problemText: '',
			problemImageFile: null,
			problemImageUrl: '',
			answerText: '',
			answerImageFile: null,
			answerImageUrl: ''
		};
	}

	async function deleteProblem(problemId: string) {
		await approvalApi.deleteProblem1(problemId);
		successStore.set('Užduotis ištrinta sėkmingai');
		const problemsResponse = await approvalApi.getProblemsBySource(sourceId);
		submittedProblems = problemsResponse.data;
	}

	async function deleteSource() {
		await approvalApi.deleteSource1(sourceId);
		successStore.set('Šaltinis ištrintas sėkmingai');
		goto('/submit/dashboard');
	}
</script>

<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit/dashboard')} class="w-16 my-2">Grįžti</Button>
	</div>
	<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio redagavimas</h1>
	<div class="w-28"></div>
</div>

<div>
	<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>
	<h3 class="text-lg text-blue-600 text-center">
		Vos pateikę užduotis galite jas <a href="/sort-dashboard">rūšiuoti</a> į kategorijas!
	</h3>
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
	<Button color="red" on:click={deleteSource} class="absolute top-5 right-5 z-10">Ištrinti</Button>
	<SourceCreateForm bind:sourceData />
	<Button
		disabled={!isSourceDataChanged}
		color="yellow"
		on:click={updateSource}
		class="w-fit absolute right-2 bottom-2">Pateikti pakeitimą peržiūrai</Button
	>
</div>

<div class="container mx-auto">
	{#each submittedProblems as problem}
		<div class="relative my-3">
			<div>Užduotis {problem.sourceListNr}</div>
			<Button
				color="red"
				on:click={() => deleteProblem(problem.id)}
				class="absolute top-10 right-20 z-10"
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
	nutempkite paveikslėlį): <a
		class="underline"
		href="https://latex.codecogs.com/eqneditor/editor.php"
		target="_blank">https://latex.codecogs.com/eqneditor/editor.php</a
	>
</p>
<p>
	Tekstas rašomas markdown sintakse. Svarbiausia - naujai eilutei reikia dviejų Enter, galite rašyti
	LaTex formules. Daugiau galite paskaityti čia: <a
		href="https://www.markdownguide.org/cheat-sheet/">https://www.markdownguide.org/cheat-sheet/</a
	>. Taip pat formules galite įkelti kaip paveikslėlius, naudodamiesi
	https://latex.codecogs.com/eqneditor/editor.php
</p>

<div class="relative">
	<ProblemCreateForm problemData={newProblem} />
	<Button color="purple" on:click={submitProblem} class="w-fit absolute right-2 bottom-2"
		>Pateikti peržiūrai</Button
	>
</div>
