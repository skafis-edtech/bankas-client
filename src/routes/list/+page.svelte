<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import 'katex/dist/katex.css';
	import 'carta-md/default.css';
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { publicApi } from '$services/apiService';
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import { CloseOutline, PlusOutline } from 'flowbite-svelte-icons';
	import type { Writable } from 'svelte/store';

	let skfList: string[] = [];
	let problems: ProblemDisplayViewDto[] = [];
	let pdfTitle = 'Užduotys';
	let includeLink = true;
	let printAnswers = false;
	let windowLocation: string | null = null;
	let isDifferentList = false;

	$: isDifferentList = JSON.stringify($list) !== JSON.stringify(skfList);

	const { list, setList }: { list: Writable<string[]>; setList: (value: string[]) => void } =
		getContext<any>('skfList');

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const listValue = urlParams.get('list') || '';
		skfList = listValue
			.split(' ')
			.filter((item) => !isNaN(Number(item)))
			.map((item) => `SKF-${item}`);
		if (skfList[0] === 'SKF-') {
			skfList = [...$list]; // Ensure reactivity by copying $list
			updateUrl();
		}

		const problemPromises = skfList.map((skfCode) => publicApi.getProblemBySkfCode(skfCode));
		const problemResponses = await Promise.all(problemPromises);
		problems = problemResponses.map((response) => response.data);

		// Accessing window only after component has been mounted
		windowLocation = window.location.href.slice(8);
	});

	function addSkfItem() {
		setList([...$list, `SKF-`]);
	}

	function updateSkfItem(index: number, e: Event) {
		const value = (e.target as HTMLInputElement).value;
		const updatedList = [...$list];
		updatedList[index] = value;
		setList(updatedList);
	}

	function removeSkfItem(index: number) {
		const updatedList = $list.filter((_, i) => i !== index);
		setList(updatedList);
	}

	function updateUrl() {
		const queryParams = new URLSearchParams(window.location.search);
		queryParams.set('list', skfList.map((item) => item.replace('SKF-', '')).join(' '));
		const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
		history.replaceState(null, '', newUrl);
		windowLocation = window.location.href.slice(8);
	}

	function reloadPage() {
		window.location.reload();
	}
	function clearList() {
		setList([]);
	}
</script>

<div class="no-print">
	<h1 class="text-4xl font-semibold my-4 text-center">Atrinktų užduočių sąrašas</h1>
	<p class="text-center mb-4">
		Atrinkta pagal nuorodą - ją galite kopijuoti ir dalintis. Daugiau funkcionalumų apačioje
	</p>
	{#if problems.length > 0}
		{#each problems as problem, i}
			<div class="relative my-2">
				<p class="absolute top-1 left-2">{i + 1}.</p>
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
		<p>
			<strong>Užduočių nėra. </strong>
			<em
				>Taip yra todėl, nes nuorodoje esantis sąrašas yra tuščias, kai turėtų būti kažkas panašaus
				kaip bankas.skafis.lt/list?list=5+1+102</em
			>
		</p>

		<img alt="Nuorodos pavyzdys" src="/tutorial2.png" class="border-2 border-black" />
		<p>
			<em
				>Jei pridėjote užduotis į sąrašą bet nematote, spauskite apačioje "Rodyti Jūsų sukurtą
				sąrašą"</em
			>
		</p>
		<img alt="Kur spausti, kad rodyti sąrašą" src="/tutorial3.png" class="border-2 border-black" />
	{/if}
</div>

<div class="md:w-1/2 flex flex-col m-auto gap-2 my-12 no-print">
	<h2 class="text-3xl font-semibold my-4 text-center">PDF generavimas</h2>
	<label for="pdftitle" class="block mb-2">PDF pavadinimas</label>
	<input id="pdftitle" type="text" bind:value={pdfTitle} class="w-full p-2 mb-4" />
	<div class="flex flex-row gap-2">
		<input type="checkbox" bind:checked={includeLink} />
		<p>Pridėti nuorodą, t.y. užduočių numerių sąrašą</p>
	</div>
	<ButtonGroup class="m-auto">
		<Button
			color={printAnswers ? 'alternative' : 'green'}
			on:click={() => {
				printAnswers = false;
			}}>Užduotys</Button
		>
		<Button
			color={printAnswers ? 'blue' : 'alternative'}
			on:click={() => {
				printAnswers = true;
			}}>Atsakymai</Button
		></ButtonGroup
	>
	<Button
		color="blue"
		on:click={() => {
			window.print();
		}}>Atsisiųsti PDF (spausdinti)</Button
	>
</div>

<div class={`${printAnswers ? 'hidden' : ''}`}>
	<div class="hidden only-print">
		{#if problems.length > 0}
			<div class="print-col">
				<h4 class="text-center">{pdfTitle}</h4>
				{#each problems as problem, i}
					<MarkdownDisplay
						value={(i + 1).toString() +
							'\\. ' +
							problem.problemText +
							(problem.problemImageSrc.length > 0
								? `\n\n<!---The text below is autogenerated. It is amended during runtime--->\n![Užduoties ${problem.skfCode} paveikslėlis](${problem.problemImageSrc})`
								: '')}
					/>
				{/each}
			</div>

			<div class="print-col">
				<h4 class="text-center">{pdfTitle}</h4>
				{#each problems as problem, i}
					<MarkdownDisplay
						value={(i + 1).toString() +
							'\\. ' +
							problem.problemText +
							(problem.problemImageSrc.length > 0
								? `\n\n<!---The text below is autogenerated. It is amended during runtime--->\n![Užduoties ${problem.skfCode} paveikslėlis](${problem.problemImageSrc})`
								: '')}
					/>
				{/each}
			</div>
		{:else}
			<p>Nėra užduočių</p>
		{/if}
		<div class="fixed bottom-0 right-2 text-[8px]">
			{includeLink ? windowLocation : 'Sugeneruota bankas.skafis.lt'}
		</div>
		<div class="fixed bottom-0 right-[50%] text-[8px]">
			{includeLink ? windowLocation : 'Sugeneruota bankas.skafis.lt'}
		</div>
	</div>
</div>

<div class={`${printAnswers ? '' : 'hidden'}`}>
	<div class="hidden only-print">
		{#if problems.length > 0}
			<div class="print-col">
				<h4 class="text-center">{pdfTitle} (atsakymai)</h4>
				{#each problems as problem, i}
					<MarkdownDisplay
						value={(i + 1).toString() +
							'\\. ' +
							problem.answerText +
							(problem.answerImageSrc.length > 0
								? `\n\n<!---The text below is autogenerated. It is amended during runtime--->\n![Užduoties ${problem.skfCode} paveikslėlis](${problem.answerImageSrc})`
								: '')}
					/>
				{/each}
			</div>

			<div class="print-col">
				<h4 class="text-center">{pdfTitle} (atsakymai)</h4>
				{#each problems as problem, i}
					<MarkdownDisplay
						value={(i + 1).toString() +
							'\\. ' +
							problem.answerText +
							(problem.answerImageSrc.length > 0
								? `\n\n<!---The text below is autogenerated. It is amended during runtime--->\n![Užduoties ${problem.skfCode} paveikslėlis](${problem.answerImageSrc})`
								: '')}
					/>
				{/each}
			</div>
		{:else}
			<p>Nėra užduočių</p>
		{/if}
		<div class="fixed bottom-0 right-2 text-[8px]">
			{includeLink ? windowLocation : 'Sugeneruota bankas.skafis.lt'}
		</div>
		<div class="fixed bottom-0 right-[50%] text-[8px]">
			{includeLink ? windowLocation : 'Sugeneruota bankas.skafis.lt'}
		</div>
	</div>
</div>

<div class="no-print mt-24 border-t-2 border-black">
	<h2 class="text-3xl font-semibold my-4 text-center">Jūsų sukurtas sąrašas</h2>
	<p class="text-center mb-4">
		{isDifferentList ? '(šiuo metu rodomas sąrašas skiriasi)' : '(šiuo metu yra rodomas)'}
	</p>
	{#if $list.length > 0}
		<div class="flex flex-col gap-2 flex-wrap h-48">
			{#each $list as skf, index}
				<div class="flex flex-row gap-2 items-center w-28">
					<Input
						type="text"
						bind:value={skf}
						on:input={(e) => updateSkfItem(index, e)}
						class="p-1 border-b border-gray-400 focus:outline-none"
					/>
					<Button
						color="red"
						on:click={() => removeSkfItem(index)}
						class="w-5 h-5 bg-red-600 rounded-full flex items-center hover:bg-red-800 p-0 m-0"
						><CloseOutline class="w-full h-full p-0 m-0" /></Button
					>
				</div>
			{/each}
			<Button color="green" on:click={addSkfItem} class="h-8 w-28"><PlusOutline /></Button>
		</div>
		<Button on:click={clearList} color="red">Išvalyti sąrašą</Button>
	{:else}
		<p>
			<strong>Nėra sąrašo. </strong><em
				>Sąrašą galite sukurti pažymėdami atskiras užduotis arba suvesdami kodus čia.</em
			>
			<img
				alt="Kur pridėti užduotį prie sąrašo"
				src="/tutorial1.png"
				class="border-2 border-black"
			/>
		</p>
		<Button color="green" on:click={addSkfItem} class="h-8 w-28"><PlusOutline /></Button>
	{/if}
	{#if isDifferentList}
		<div class="flex flex-row justify-center gap-4 mt-4">
			<Button
				on:click={() => {
					history.replaceState(null, '', '/list');
					reloadPage();
				}}
				color="blue">Rodyti Jūsų sukurtą sąrašą</Button
			>
		</div>
	{/if}
</div>

<style>
	@media print {
		.only-print {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap; /* Prevent wrapping to keep content within columns */
			justify-content: space-between; /* Distribute columns evenly */
			align-items: flex-start;
			margin: 0;
			padding: 0;
		}

		.print-col {
			width: 48%; /* Each column takes up about half the page */
			margin-bottom: 0;
			display: block;
			margin: 0;
			padding: 0;
			transform-origin: top left;
			transform: scale(0.85); /* Adjust scale to fit content within columns */
		}

		@page {
			margin: 0;
		}
	}
</style>
