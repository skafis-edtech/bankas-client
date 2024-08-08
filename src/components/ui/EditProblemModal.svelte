<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import type { Components } from '../../types';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import SmallFileUpload from '$components/forms/SmallFileUpload.svelte';
	import { onMount } from 'svelte';

	export let open: boolean;
	export let problem: Components.ProblemEditData;

	let problemTexts: { sourceListNr: number; problemText: string; answerText: string };

	let problemImageTempDisplay: string = '';
	let answerImageTempDisplay: string = '';

	// Initialize problemTexts from problem
	$: if (problem) {
		problemTexts = {
			sourceListNr: problem.sourceListNr,
			problemText: problem.problemText,
			answerText: problem.answerText
		};
		problemImageTempDisplay = problem.problemImageSrc;
		answerImageTempDisplay = problem.answerImageSrc;
	}

	let problemImageFile: File | null = null;
	let answerImageFile: File | null = null;

	function updateProblemTexts() {
		alert('PUT /approval/problem/texts' + problem.id);
	}

	function deleteProblemImage() {
		problemImageTempDisplay = '';
		alert('DELETE /approval/problem/problemImage/' + problem.id);
	}

	function deleteAnswerImage() {
		answerImageTempDisplay = '';
		alert('DELETE /approval/problem/answerImage/' + problem.id);
	}

	function uploadProblemImage() {
		alert('POST /approval/problem/problemImage/' + problem.id);
	}

	function uploadAnswerImage() {
		alert('POST /approval/problem/answerImage/' + problem.id);
	}
</script>

<Modal bind:open>
	<div class="p-4">
		<h1 class="text-2xl font-semibold">Redaguojama {problem.id} užduotis</h1>
		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti eilės numerį</p>
			<input type="number" bind:value={problemTexts.sourceListNr} />
			<p class="text-gray-600">Redaguoti klausimo tekstą</p>
			<MarkdownInput bind:value={problemTexts.problemText} />
			<p class="text-gray-600">Redaguoti atsakymo tekstą</p>
			<MarkdownInput bind:value={problemTexts.answerText} />
			<Button class="mt-4" color="primary" size="lg" on:click={updateProblemTexts}>Išsaugoti</Button
			>
			<Button class="mt-4" color="alternative" size="lg">Atšaukti</Button>
		</div>

		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti klausimo paveiksliuką</p>
			{#if problemImageTempDisplay}
				<img src={problemImageTempDisplay} alt="Užduoties paveikslėlis" />
				<Button class="mt-4" color="red" size="lg" on:click={deleteProblemImage}>Ištrinti</Button>
			{:else}
				<SmallFileUpload
					bind:imageFile={problemImageFile}
					bind:tempImageDisplay={problemImageTempDisplay}
				/>
				<Button class="mt-4" color="primary" size="lg" on:click={uploadProblemImage}
					>Išsaugoti</Button
				>
			{/if}
		</div>

		<div class="my-8 border-2 p-4">
			<p class="text-gray-600">Redaguoti atsakymo paveiksliuką</p>
			{#if answerImageTempDisplay}
				<img src={answerImageTempDisplay} alt="Atsakymo paveikslėlis" />
				<Button class="mt-4" color="red" size="lg" on:click={deleteAnswerImage}>Ištrinti</Button>
			{:else}
				<SmallFileUpload
					bind:imageFile={answerImageFile}
					bind:tempImageDisplay={answerImageTempDisplay}
				/>
				<Button class="mt-4" color="primary" size="lg" on:click={uploadAnswerImage}
					>Išsaugoti</Button
				>
			{/if}
		</div>
	</div>
</Modal>
