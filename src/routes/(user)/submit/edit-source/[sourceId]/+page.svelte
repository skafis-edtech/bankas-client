<script lang="ts">
	import { Button, Card, Modal } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import {
		SourceDisplayDtoVisibilityEnum,
		SourceSubmitDtoVisibilityEnum,
		type ProblemDisplayViewDto,
		type SourceDisplayDto,
		type SourceSubmitDto
	} from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import type { Components } from '../../../../../types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import MultipleFileUploadModal from '$components/ui/MultipleFileUploadModal.svelte';
	import { CloseOutline, EditOutline, PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import EditProblemModal from '$components/ui/EditProblemModal.svelte';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import FindById from '$components/layout/home/FindById.svelte';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import SourceEditForm from '$components/forms/SourceEditForm.svelte';
	import { contentApi, viewApi } from '$services/apiService';

	let sourceId: string;
	$: sourceId = $page.params.sourceId;

	let oldSourceData: SourceDisplayDto;
	let submittedProblems: ProblemDisplayViewDto[] = [];

	let sourceData: SourceSubmitDto = {
		name: '',
		description: '',
		visibility: SourceSubmitDtoVisibilityEnum.Private
	};

	let newProblems: Components.ProblemCreateFormData[] = [];
	$: newProblems = [...newProblems].sort((a, b) => a.sourceListNr - b.sourceListNr);

	let isSourceDataChanged = false;
	$: {
		isSourceDataChanged =
			oldSourceData?.name !== sourceData?.name ||
			oldSourceData?.description !== sourceData?.description;
	}

	$: {
		const lastSourceListNr = submittedProblems[submittedProblems.length - 1]?.sourceListNr || 0;
		newProblems = newProblems.map((problem, index) => ({
			...problem,
			sourceListNr: lastSourceListNr + index + 1
		}));
	}

	onMount(async () => {
		const sourceResponse = await viewApi.getSourceById(sourceId);
		oldSourceData = sourceResponse.data;
		sourceData = {
			name: oldSourceData.name,
			description: oldSourceData.description,
			visibility: oldSourceData.visibility
		};

		await loadAllProblems();

		let nextSourceListNr;
		if (submittedProblems.length === 0) {
			nextSourceListNr = 1;
		} else nextSourceListNr = submittedProblems[submittedProblems.length - 1].sourceListNr + 1;

		newProblems = [
			{
				sourceListNr: nextSourceListNr,
				problemText: '',
				answerText: '',
				problemImageFile: null,
				answerImageFile: null,
				tempProblemImageDisplay: undefined,
				tempAnswerImageDisplay: undefined
			}
		];
	});

	async function loadAllProblems() {
		const problemsResponse = await viewApi.getProblemsBySource(
			sourceId,
			0,
			oldSourceData.problemCount
		);
		submittedProblems = problemsResponse.data;
	}

	async function updateSource() {
		await contentApi.updateSource(sourceId, sourceData);
		successStore.set('Šaltinis sėkmingai pakeistas');
		const sourceResponse = await viewApi.getSourceById(sourceId);
		oldSourceData = sourceResponse.data;
	}

	async function submitProblem(index: number) {
		if (!newProblems[index].problemText && !newProblems[index].problemImageFile) {
			console.log(newProblems[index]);
			alert('Užduotis turi turėti tekstą arba paveikslėlį');
			return;
		}
		const response = await contentApi.submitProblem(
			sourceId,
			{
				sourceListNr: newProblems[index].sourceListNr,
				problemText: newProblems[index].problemText,
				answerText: newProblems[index].answerText
			},
			newProblems[index].problemImageFile!!,
			newProblems[index].answerImageFile!!
		);
		successStore.set('Užduotis pateikta sėkmingai');

		submittedProblems = [
			...submittedProblems,
			{
				id: response.data.id,
				skfCode: '',
				sourceListNr: newProblems[index].sourceListNr,
				problemText: newProblems[index].problemText,
				answerText: newProblems[index].answerText,
				problemImageSrc: newProblems[index].tempProblemImageDisplay || '',
				answerImageSrc: newProblems[index].tempAnswerImageDisplay || '',
				categories: [],
				sourceId: sourceId
			}
		];
		removeProblem(index);

		if (newProblems.length === 0) {
			const nextSourceListNr =
				submittedProblems[submittedProblems.length - 1]?.sourceListNr + 1 || 1;

			newProblems = [
				{
					sourceListNr: nextSourceListNr,
					problemText: '',
					answerText: '',
					problemImageFile: null,
					answerImageFile: null,
					tempProblemImageDisplay: undefined,
					tempAnswerImageDisplay: undefined
				}
			];
		}
	}

	async function deleteProblem(problemId: string) {
		if (!confirm('Ar tikrai norite ištrinti šią užduotį?')) {
			return;
		}
		await contentApi.deleteProblem(problemId);
		successStore.set('Užduotis ištrinta sėkmingai');
		submittedProblems = submittedProblems.filter((problem) => problem.id !== problemId);
	}

	async function deleteSource() {
		if (submittedProblems.length > 0) {
			alert('Pirmiausia ištrinkite visas šaltinio užduotis.');
			return;
		}
		if (!confirm('Ar tikrai norite ištrinti šaltinį?')) {
			return;
		}
		await contentApi.deleteSource(sourceId);
		successStore.set('Šaltinis ištrintas sėkmingai');
		goto('/submit/dashboard');
	}

	function removeProblem(index: number) {
		newProblems = newProblems.filter((_, i) => i !== index);
	}

	function addProblem() {
		let nr;
		if (newProblems.length === 0) {
			nr = 1;
		} else nr = newProblems[newProblems.length - 1].sourceListNr + 1;

		newProblems = [
			...newProblems,
			{
				sourceListNr: nr,
				problemText: '',
				answerText: '',
				problemImageFile: null,
				answerImageFile: null,
				tempProblemImageDisplay: undefined,
				tempAnswerImageDisplay: undefined
			}
		];
	}

	/* MultipleFileUploadModal */
	let isDropModalOpen = false;
	let groupedUpload: { listNr: number; file: File | null; display: string }[] = [];
	function fillInFileListFromGroupedUpload() {
		isDropModalOpen = false;
		newProblems = groupedUpload.map((upload) => ({
			sourceListNr: upload.listNr,
			problemText: '',
			answerText: '',
			problemImageFile: upload.file,
			answerImageFile: null,
			tempProblemImageDisplay: upload.display,
			tempAnswerImageDisplay: undefined
		}));
	}

	/* Edit modal */
	let isProblemEditModalOpen = false;

	let editModalProblem: Components.ProblemEditData = {
		id: '',
		sourceListNr: 0,
		problemText: '',
		answerText: '',
		problemImageSrc: '',
		answerImageSrc: ''
	};
	let editModalProblemImageTempDisplay = '';
	let editModalAnswerImageTempDisplay = '';

	function openEditModal(problemId: string) {
		const problemForEdit = submittedProblems.find((problem) => problem.id === problemId);
		if (problemForEdit) {
			editModalProblem = {
				id: problemId,
				sourceListNr: problemForEdit.sourceListNr || 0,
				problemText: problemForEdit.problemText || '',
				answerText: problemForEdit.answerText || '',
				problemImageSrc: problemForEdit.problemImageSrc || '',
				answerImageSrc: problemForEdit.answerImageSrc || ''
			};
			isProblemEditModalOpen = true;
		}
	}

	function closeEditModal() {
		isProblemEditModalOpen = false;
		submittedProblems = submittedProblems.map((problem) => {
			if (problem.id === editModalProblem.id) {
				return {
					...problem,
					sourceListNr: editModalProblem.sourceListNr,
					problemText: editModalProblem.problemText,
					answerText: editModalProblem.answerText,
					problemImageSrc: editModalProblem.problemImageSrc,
					answerImageSrc: editModalProblem.answerImageSrc
				};
			}
			return problem;
		});

		editModalProblem = {
			id: '',
			sourceListNr: 0,
			problemText: '',
			answerText: '',
			problemImageSrc: '',
			answerImageSrc: ''
		};
	}

	/* Source info edit modal*/
	let isSourceModalOpen = false;
</script>

<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit/dashboard')} class="w-fit my-2"
			>Grįžti į šaltinių sąrašą</Button
		>
	</div>
	<h1 class="text-4xl font-semibold my-4 text-center">
		Šaltinio pildymas užduotimis (redagavimas)
	</h1>
	<div class="w-28 flex align-middle">
		<Button
			color="alternative"
			on:click={() => (isDropModalOpen = true)}
			class="w-fit my-auto text-sm p-2">Automatizuoti</Button
		>
	</div>
</div>

{#if sourceData.visibility === SourceDisplayDtoVisibilityEnum.Public}
	<p class="text-justify mx-4 my-4">
		Išsaugotos "Viešos" užduotys yra iškart pateikiamos peržiūrai. Peržiūrėtos ir patvirtintos
		užduotys bus paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu. Šaltinių
		patvirtinimai ir atmetimai yra atšaukiami, jei yra atliekami pakeitimai šaltinio informacijoje
		arba uždaviniuose. Prisiminkite, kad sutikote su <a href="/about#upload-terms">sąlygomis</a> :).
	</p>
{:else}
	<p class="text-justify mx-4 my-4">Užduotys privačios ir yra matomos tik Jums.</p>
{/if}

<Card
	class="max-w-md mx-auto my-6 min-w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-row justify-between"
>
	<div>
		<h2>{sourceData.name}</h2>
		{#if sourceData.description === ''}
			<h5><em>Šaltinio aprašymas nepateiktas</em></h5>
		{:else}
			<MarkdownDisplay value={sourceData.description} />
		{/if}
	</div>
	<div>
		<em
			>{#if sourceData.visibility === SourceDisplayDtoVisibilityEnum.Public}
				Šaltinis yra viešas
			{:else}
				Šaltinis yra privatus
			{/if}</em
		>
	</div>
	<div>
		{#if sourceData.name.includes('(DAR TVARKOMA)')}
			<Button
				color="green"
				on:click={() => {
					sourceData.name = sourceData.name.replace('(DAR TVARKOMA)', '');
					updateSource();
				}}
				class="p-2 mx-1"
			>
				Sutvarkiau šaltinį su užduotimis
			</Button>
		{:else}
			<Button
				color="yellow"
				on:click={() => {
					sourceData.name += ' (DAR TVARKOMA)';
					updateSource();
				}}
				class="p-2 mx-1"
			>
				Dar tvarkau šaltinį
			</Button>
		{/if}
		<Button color="yellow" on:click={() => (isSourceModalOpen = true)} class="p-2 mx-1">
			<EditOutline class="w-6 h-6" />
		</Button>
	</div>
	<Modal open={isSourceModalOpen} on:close={() => (isSourceModalOpen = false)} size="xl">
		<div class="relative">
			<Button color="red" on:click={deleteSource} class="absolute top-5 right-5 z-10"
				>Ištrinti šaltinį</Button
			>
			<SourceEditForm bind:sourceData />
			<Button
				disabled={!isSourceDataChanged}
				color="yellow"
				on:click={() => {
					if (
						sourceData.visibility !== oldSourceData.visibility &&
						sourceData.visibility === SourceDisplayDtoVisibilityEnum.Public
					) {
						if (
							confirm(
								'Išsaugotos "Viešos" užduotys yra iškart pateikiamos peržiūrai. Peržiūrėtos ir patvirtintos užduotys bus paviešintos kartu su Jūsų prisijungimo vardu, bet ne el. paštu. Šaltinių patvirtinimai ir atmetimai yra atšaukiami, jei yra atliekami pakeitimai šaltinio informacijoje arba uždaviniuose. Prisiminkite, kad sutikote su sąlygomis :) \n\n Tęsti?'
							)
						) {
							updateSource();
							isSourceModalOpen = false;
						}
					} else {
						updateSource();
						isSourceModalOpen = false;
					}
				}}
				class="w-fit absolute right-2 bottom-2">Pateikti pakeitimą peržiūrai</Button
			>
		</div>
	</Modal>
</Card>
<div class="container mx-auto">
	{#each submittedProblems as problem}
		<div class="relative my-3">
			<div>Užduotis {problem.sourceListNr}</div>
			<Button
				color="red"
				on:click={() => deleteProblem(problem.id)}
				class="absolute top-9 right-14 z-10 p-2 mx-1"
			>
				<TrashBinOutline class="w-6 h-6" />
			</Button>
			<Button
				color="yellow"
				on:click={() => openEditModal(problem.id)}
				class="absolute top-9 right-28 z-10 p-2 mx-1"
			>
				<EditOutline class="w-6 h-6" />
			</Button>
			<ProblemComponent
				problemMainData={{
					skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
					problemText: problem.problemText,
					problemImageSrc: problem.problemImageSrc,
					answerText: problem.answerText,
					answerImageSrc: problem.answerImageSrc,
					categories: problem.categories,
					sourceId: problem.sourceId
				}}
			/>
		</div>
	{/each}
</div>

<EditProblemModal
	bind:open={isProblemEditModalOpen}
	bind:problem={editModalProblem}
	onClose={closeEditModal}
	bind:problemImageTempDisplay={editModalProblemImageTempDisplay}
	bind:answerImageTempDisplay={editModalAnswerImageTempDisplay}
/>

<MultipleFileUploadModal
	bind:open={isDropModalOpen}
	bind:groupedUpload
	onSubmit={fillInFileListFromGroupedUpload}
/>
{#each newProblems as problem, i}
	<div class="relative">
		<Button
			color="primary"
			on:click={() => removeProblem(i)}
			class="w-10 h-10 absolute right-2 top-2"><CloseOutline /></Button
		>
		<ProblemCreateForm problemData={problem} />
		<Button color="purple" on:click={() => submitProblem(i)} class="w-fit absolute right-2 bottom-2"
			>Pridėti prie sąrašo</Button
		>
	</div>
{/each}

<Button color="green" on:click={addProblem} class="w-full"><PlusOutline /></Button>
<HorizontalLine />
<FindById />
