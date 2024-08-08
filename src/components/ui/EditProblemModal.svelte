<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import type { Components } from '../../types';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import SmallFileUpload from '$components/forms/SmallFileUpload.svelte';
	import { onMount } from 'svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';

	export let open: boolean;
	export let problem: Components.ProblemEditData;
	export let problemImageTempDisplay: string;
	export let answerImageTempDisplay: string;

	let problemImageFile: File | null = null;
	let answerImageFile: File | null = null;

	function updateProblemTexts() {
		alert('PUT /approval/problem/texts' + problem.id);
		console.log(problem);
	}

	function deleteProblemImage() {
		problem.problemImageSrc = '';
		alert('DELETE /approval/problem/problemImage/' + problem.id);
	}

	function deleteAnswerImage() {
		problem.answerImageSrc = '';
		alert('DELETE /approval/problem/answerImage/' + problem.id);
	}

	function uploadProblemImage() {
		problemImageFile = null;
		problemImageTempDisplay = '';
		alert('POST /approval/problem/problemImage/' + problem.id);
		problem.problemImageSrc = 'https://via.placeholder.com/400x150';
	}

	function uploadAnswerImage() {
		answerImageFile = null;
		answerImageTempDisplay = '';
		alert('POST /approval/problem/answerImage/' + problem.id);
		problem.answerImageSrc = 'https://via.placeholder.com/400x150';
	}
</script>

<Modal bind:open>
	<div class="p-4">
		<h1 class="text-2xl font-semibold">Redaguojama {problem.id} užduotis</h1>
		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti eilės numerį</p>
			<input type="number" bind:value={problem.sourceListNr} />
			<p class="text-gray-600">Redaguoti klausimo tekstą</p>
			<MarkdownInput bind:value={problem.problemText} />
			<p class="text-gray-600">Redaguoti atsakymo tekstą</p>
			<MarkdownInput bind:value={problem.answerText} />
			<Button class="mt-4" color="primary" size="lg" on:click={updateProblemTexts}>Išsaugoti</Button
			>
			<Button class="mt-4" color="alternative" size="lg">Atšaukti</Button>
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
				<Button class="mt-4" color="primary" size="lg" on:click={uploadProblemImage}
					>Išsaugoti</Button
				>
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
				<Button class="mt-4" color="primary" size="lg" on:click={uploadAnswerImage}
					>Išsaugoti</Button
				>
			{:else}
				<p class="text-gray-600">Paveiksliukas įkeliamas... (arba klaida)</p>
			{/if}
		</div>
	</div>
</Modal>
