<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Components } from '../../../types';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { approvalApi } from '$services/apiService';
	import type { SourceSubmitDto } from '$services/gen-client';

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
		const sourceId = idResponse.data.id;
		alert('Šaltinis pateiktas sėkmingai');
		await Promise.all(
			problems.map(async (problem) => {
				await approvalApi.submitProblem1(
					sourceId,
					{
						problemText: problem.problemText,
						problemImageUrl: problem.problemImageUrl,
						answerText: problem.answerText,
						answerImageUrl: problem.answerImageUrl
					},
					problem.problemImageFile!!,
					problem.answerImageFile!!
				);
				alert('Viena iš užduočių pateikta sėkmingai');
			})
		);
		goto('/submit-dashboard');
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio įkėlimas</h1>
<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>

<Button
	on:click={() => {
		if (confirm('Duomenys nebus išsaugoti. Ar tikrai norite grįžti?')) {
			goto('/submit-dashboard');
		}
	}}
	class="ml-4">Grįžti</Button
>

<SourceCreateForm {sourceData} />

<p class="text-center">
	Darydami ekrano nuotraukas rinkitės kiek įmanoma didesnį mastelį, kad būtų geresnė kokybė
</p>

{#each problems as problem, i}
	<div class=" relative">
		<Button
			color="red"
			on:click={() => (problems = problems.filter((_, index) => index !== i))}
			class="w-10 h-10 absolute right-2 top-2"><TrashBinSolid /></Button
		>
		<ProblemCreateForm problemData={problem} index={i} />
	</div>
{/each}

<Button
	color="green"
	on:click={() =>
		(problems = [
			...problems,
			{
				problemText: '',
				problemImageFile: null,
				problemImageUrl: '',
				answerText: '',
				answerImageFile: null,
				answerImageUrl: ''
			}
		])}
	class="w-full"><PlusOutline /></Button
>

<p class="text-justify mx-4 my-4">
	Spausdami mygtuką "Pateikti šaltinį su užduotimis peržiūrai" Jūs patvirtinate, kad įkeliate tik
	savo sukurtas originalias užduotis arba užduotis, kurios jau yra pasiekiamos viešai. Pateikdami
	savo užduotis atsisakote turtinių autorinių teisių į šias užduotis, leidžiate užduotimis naudotis
	bet kam. Pateikdami kitų autorių užduotis patvirtinate, kad tie autoriai yra atsisakę turtinių
	autorinių teisių bei taip pat leidžia naudotis užduotimis bet kam. Peržiūrėtos ir patvirtintos
	užduotys bus paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu.
</p>
<div class="flex flex-row justify-center">
	<Button color="purple" on:click={submitSource}>Pateikti šaltinį su užduotimis peržiūrai</Button>
</div>
