<script lang="ts">
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import ProblemCreateForm from '$components/forms/ProblemCreateForm.svelte';
	import {
		ProblemDisplayViewDtoProblemVisibilityEnum,
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
	import MultipleFileUploadModal from '$components/edit-source/MultipleFileUploadModal.svelte';
	import { CloseOutline, EditOutline, PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import EditProblemModal from '$components/edit-source/EditProblemModal.svelte';
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import FindById from '$components/layout/FindById.svelte';
	import HorizontalLine from '$components/ui/HorizontalLine.svelte';
	import { contentApi, sourceViewApi } from '$services/apiService';
	import SourceModal from '$components/edit-source/SourceModal.svelte';

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
	// Temporary data used in the modal
	let tempSourceData: SourceSubmitDto;

	// When the modal is opened, create a copy of sourceData
	function openSourceModal() {
		tempSourceData = { ...sourceData };
		isSourceModalOpen = true;
	}

	// Save changes from the modal
	async function saveSourceChanges() {
		// Only update the sourceData if changes were made
		if (isSourceDataChanged) {
			sourceData = { ...tempSourceData };
			await updateSource();
		}
		isSourceModalOpen = false;
	}

	// This function will check if there are any changes to the source data
	$: isSourceDataChanged =
		oldSourceData?.name !== tempSourceData?.name ||
		oldSourceData?.description !== tempSourceData?.description ||
		oldSourceData?.visibility !== tempSourceData?.visibility;

	$: {
		const lastSourceListNr = submittedProblems[submittedProblems.length - 1]?.sourceListNr || 0;
		newProblems = newProblems.map((problem, index) => ({
			...problem,
			sourceListNr: lastSourceListNr + index + 1
		}));
	}

	onMount(async () => {
		const sourceResponse = await sourceViewApi.getSourceById(sourceId);
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
		const problemsResponse = await sourceViewApi.getProblemsBySource(
			sourceId,
			0,
			oldSourceData.problemCount
		);
		submittedProblems = problemsResponse.data;
	}

	async function updateSource() {
		await contentApi.updateSource(sourceId, sourceData);
		successStore.set('Šaltinis sėkmingai pakeistas');
		const sourceResponse = await sourceViewApi.getSourceById(sourceId);
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
				skfCode: response.data.skfCode,
				sourceListNr: newProblems[index].sourceListNr,
				problemText: newProblems[index].problemText,
				answerText: newProblems[index].answerText,
				problemImageSrc: newProblems[index].tempProblemImageDisplay || '',
				answerImageSrc: newProblems[index].tempAnswerImageDisplay || '',
				categories: [],
				sourceId: sourceId,
				problemVisibility: ProblemDisplayViewDtoProblemVisibilityEnum.Visible
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

<div class="flex justify-between items-center">
	<div class="w-48">
		<Button
			color="alternative"
			on:click={() => (isDropModalOpen = true)}
			class="w-fit my-auto text-sm p-2">Automatizuoti</Button
		>
	</div>
	<div>
		<h1 class="text-4xl font-semibold my-4 text-center">
			{sourceData.visibility === SourceDisplayDtoVisibilityEnum.Public ? '🌐' : '🔒'}
			{sourceData.name}
		</h1>
	</div>

	<div class="w-48 flex items-center gap-4">
		<Button color="yellow" on:click={openSourceModal} class="p-2 gap-2">
			<EditOutline class="w-6 h-6" /> Redaguoti
		</Button>
		<Button color="red" on:click={deleteSource} class="p-2">
			<TrashBinOutline class="w-6 h-6" />
		</Button>
	</div>
</div>
<div class="mt-2 mb-6 p-2 bg-white flex flex-row justify-between">
	<div>
		{#if sourceData.description === ''}
			<h5><em>Šaltinio aprašymas nepateiktas</em></h5>
		{:else}
			<MarkdownDisplay value={sourceData.description} />
		{/if}
	</div>
	<SourceModal
		isOpen={isSourceModalOpen}
		bind:sourceData={tempSourceData}
		{isSourceDataChanged}
		on:closeModal={() => (isSourceModalOpen = false)}
		on:saveSourceChanges={saveSourceChanges}
	/>
</div>

{#if sourceData.visibility === SourceDisplayDtoVisibilityEnum.Public}
	<Alert color="blue" border class="mt-2">
		Užduotys pateiktos peržiūrai. Peržiūrėtos ir patvirtintos užduotys bus paviešintos kartu su Jūsų
		prisijungimo vardu, bet ne el. paštu. Šaltinių patvirtinimai ir atmetimai yra atšaukiami, jei
		yra atliekami pakeitimai šaltinio informacijoje arba uždaviniuose. Prisiminkite, kad sutikote su <a
			href="/about#upload-terms">sąlygomis</a
		> :)
	</Alert>
{/if}

<div class="container mx-auto">
	{#each submittedProblems as problem}
		<div class="flex gap-2">
			<div class="text-sm">{problem.sourceListNr}.</div>
			<div class="relative my-1 w-full">
				<Button
					color="red"
					on:click={() => deleteProblem(problem.id)}
					class="absolute top-2 right-9 z-10 p-1"
				>
					<TrashBinOutline class="w-4 h-4" />
				</Button>
				<Button
					color="yellow"
					on:click={() => openEditModal(problem.id)}
					class="absolute top-2 right-16 z-10 p-1"
				>
					<EditOutline class="w-4 h-4" />
				</Button>
				<ProblemComponent
					problemMainData={{
						skfCode: problem.skfCode === '' ? problem.id : problem.skfCode,
						problemText: problem.problemText,
						problemImageSrc: problem.problemImageSrc,
						answerText: problem.answerText,
						answerImageSrc: problem.answerImageSrc,
						categories: problem.categories,
						sourceId: problem.sourceId,
						visibility: problem.problemVisibility
					}}
					canList={false}
				/>
			</div>
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
