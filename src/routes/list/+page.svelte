<script lang="ts">
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { publicApi } from '$services/apiService';
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let skfList: string[] = [];
	let problems: ProblemDisplayViewDto[] = [];
	let html2pdf: any;

	onMount(async () => {
		// Dynamically import html2pdf.js only on the client-side
		html2pdf = await import('html2pdf.js').then((module) => module.default);

		const urlParams = new URLSearchParams(window.location.search);
		const listValue = urlParams.get('list') || '';
		skfList = listValue.split(',').map((item) => `SKF-${item}`);
		const problemPromises = skfList.map((skfCode) => publicApi.getProblemBySkfCode(skfCode));
		const problemResponses = await Promise.all(problemPromises);
		problems = problemResponses.map((response) => response.data);
	});

	function downloadPdf() {
		// Ensure html2pdf.js is loaded
		if (!html2pdf) {
			console.error('html2pdf.js has not been loaded.');
			return;
		}

		const content = document.getElementById('content') as HTMLElement;
		//		const content = document.querySelector('.carta-renderer') as HTMLElement;

		const opt = {
			margin: 0.5,
			filename: 'styled-content.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
		};

		// Generate the PDF using html2pdf
		html2pdf().from(content).set(opt).save();
	}

	function downloadPdfNoAns() {
		// Similar logic can be used here to generate a PDF without answers
		// For simplicity, this is left as an exercise to implement.
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">SKF sąrašas</h1>
{#if skfList.length > 0}
	<ul class="list-disc list-inside">
		{#each skfList as skf}
			<li>{skf}</li>
		{/each}
	</ul>
{:else}
	<p>Nėra sąrašo</p>
{/if}

<h1 class="text-4xl font-semibold my-4 text-center">Užduotys</h1>
{#if problems.length > 0}
	<Button color="blue" on:click={downloadPdfNoAns}>Atsisiųsti PDF be atsakymų</Button>
	<p>Užduočių skaičius: {problems.length}</p>
	{#each problems as problem, i}
		<div>
			<h2>{i + 1}.</h2>
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
{:else}
	<p>Nėra užduočių</p>
{/if}

<h1 class="text-4xl font-semibold my-4 text-center">PDF'ui</h1>
{#if problems.length > 0}
	{#each problems as problem, i}
		<MarkdownDisplay value={(i + 1).toString() + '. ' + problem.problemText} />
	{/each}
{:else}
	<p>Nėra užduočių</p>
{/if}

<!-- Content to be included in the PDF -->
<div id="content">
	<h1>Sample Problem</h1>
	<p>1. What is the reciprocal of <span style="font-style: italic;">1/3</span>?</p>
	<p>2. Solve the equation <strong>x<sup>2</sup> + 2x - 3 = 0</strong>.</p>
	<p>3. Factorize <strong>x + 3x<sup>2</sup></strong>.</p>
	<p>4. Which of the following numbers is divisible by both 3 and 5?</p>
	<ul>
		<li>A: 31245</li>
		<li>B: 45610</li>
		<li>C: 15658</li>
		<li>D: 15685</li>
	</ul>
</div>
<!-- Button to trigger PDF download -->
<button on:click={downloadPdf}>Download PDF</button>

<style>
	#content {
		background-color: tomato;
		color: white;
		padding: 20px;
		border-radius: 8px;
		font-family: Arial, sans-serif;
	}

	#content h1 {
		font-size: 24px;
		margin-bottom: 10px;
	}

	#content p {
		font-size: 16px;
		margin: 5px 0;
	}

	#content ul {
		list-style-type: none;
		padding: 0;
	}

	#content li {
		font-size: 16px;
		margin: 2px 0;
	}
</style>
