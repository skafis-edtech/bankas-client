<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import type { Components } from '../../types';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import SmallFileUpload from '$components/forms/SmallFileUpload.svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { approvalApi } from '$services/apiService';
	import { successStore } from '$lib/stores';

	export let open: boolean;
	export let problem: Components.ProblemEditData;
	export let problemImageTempDisplay: string;
	export let answerImageTempDisplay: string;
	export let onClose: () => void;

	let problemImageFile: File | null = null;
	let answerImageFile: File | null = null;

	async function updateProblemTexts() {
		await approvalApi.updateProblemTexts(problem.id, {
			sourceListNr: problem.sourceListNr,
			problemText: problem.problemText,
			answerText: problem.answerText
		});
		successStore.set('Atnaujinti tekstai');
		open = false;
		onClose();
	}

	async function deleteProblemImage() {
		problem.problemImageSrc = '';
		await approvalApi.deleteProblemImage(problem.id);
		successStore.set('Ištrintas užduoties paveiksliukas 🤨');
	}

	async function deleteAnswerImage() {
		problem.answerImageSrc = '';
		await approvalApi.deleteAnswerImage(problem.id);
		successStore.set('Ištrintas atsakymo paveiksliukas 😁');
	}

	async function uploadProblemImage() {
		if (!problemImageFile) {
			alert('No file to upload');
			return;
		}
		const response = await approvalApi.uploadProblemImage(problem.id, problemImageFile);
		problemImageFile = null;
		problem.problemImageSrc = problemImageTempDisplay;
		problemImageTempDisplay = '';
		successStore.set('Įkeltas užduoties paveiksliukas 😎');
		onClose();
	}

	async function uploadAnswerImage() {
		if (!answerImageFile) {
			alert('No file to upload');
			return;
		}
		const response = await approvalApi.uploadAnswerImage(problem.id, answerImageFile);
		answerImageFile = null;
		problem.answerImageSrc = answerImageTempDisplay;
		answerImageTempDisplay = '';
		successStore.set('Įkeltas atsakymo paveiksliukas 😎');
		onClose();
	}
</script>

<Modal bind:open size="xl">
	<div class="p-4">
		<h1 class="text-2xl font-semibold">Redaguojama {problem.id} užduotis</h1>
		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti eilės numerį</p>
			<input type="number" bind:value={problem.sourceListNr} />
			<p class="text-gray-600">Redaguoti klausimo tekstą</p>
			<MarkdownInput bind:value={problem.problemText} />
			<p class="text-gray-600">Redaguoti atsakymo tekstą</p>
			<MarkdownInput bind:value={problem.answerText} />

			<div class="flex flex-row gap-4 justify-end">
				<Button
					class="mt-4"
					color="alternative"
					size="lg"
					on:click={() => {
						open = false;
					}}>Uždaryti</Button
				>
				<Button class="mt-4" color="primary" size="lg" on:click={updateProblemTexts}
					>Išsaugoti</Button
				>
			</div>
		</div>

		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti klausimo paveiksliuką</p>
			{#if problem.problemImageSrc !== '' && !problemImageFile && problemImageTempDisplay === ''}
				<img src={problem.problemImageSrc} alt="Užduoties paveikslėlis" />

				<Button class="mt-4" color="red" size="lg" on:click={deleteProblemImage}>Ištrinti</Button>
			{:else if problem.problemImageSrc === '' && !problemImageFile && problemImageTempDisplay === ''}
				<SmallFileUpload
					bind:imageFile={problemImageFile}
					bind:tempImageDisplay={problemImageTempDisplay}
				/>
			{:else if problem.problemImageSrc === '' && problemImageFile && problemImageTempDisplay !== ''}
				<div class="my-6 relative w-fit border-black border-2">
					<Button
						color="red"
						on:click={() => {
							problemImageFile = null;
							problemImageTempDisplay = '';
						}}
						class="absolute top-[-15px] right-[-12px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 p-0"
						><CloseOutline class="w-full h-full p-0 m-0" /></Button
					>
					<img
						src={problemImageTempDisplay}
						alt="Uploaded"
						class="max-w-full h-auto"
						loading="lazy"
					/>
				</div>
				<div class="flex flex-row gap-4 justify-end">
					<Button class="mt-4" color="primary" size="lg" on:click={uploadProblemImage}
						>Įkelti</Button
					>
				</div>
			{:else}
				<p class="text-gray-600">Paveiksliukas įkeliamas... (arba klaida)</p>
			{/if}
		</div>

		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti atsakymo paveiksliuką</p>
			{#if problem.answerImageSrc !== '' && !answerImageFile && answerImageTempDisplay === ''}
				<img src={problem.answerImageSrc} alt="Užduoties paveikslėlis" />
				<Button class="mt-4" color="red" size="lg" on:click={deleteAnswerImage}>Ištrinti</Button>
			{:else if problem.answerImageSrc === '' && !answerImageFile && answerImageTempDisplay === ''}
				<SmallFileUpload
					bind:imageFile={answerImageFile}
					bind:tempImageDisplay={answerImageTempDisplay}
				/>
			{:else if problem.answerImageSrc === '' && answerImageFile && answerImageTempDisplay !== ''}
				<div class="my-6 relative w-fit border-black border-2">
					<Button
						color="red"
						on:click={() => {
							answerImageFile = null;
							answerImageTempDisplay = '';
						}}
						class="absolute top-[-15px] right-[-12px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 p-0"
						><CloseOutline class="w-full h-full p-0 m-0" /></Button
					>
					<img
						src={answerImageTempDisplay}
						alt="Uploaded"
						class="max-w-full h-auto"
						loading="lazy"
					/>
				</div>
				<div class="flex flex-row gap-4 justify-end">
					<Button class="mt-4" color="primary" size="lg" on:click={uploadAnswerImage}>Įkelti</Button
					>
				</div>
			{:else}
				<p class="text-gray-600">Paveiksliukas įkeliamas... (arba klaida)</p>
			{/if}
		</div>
	</div>
</Modal>
