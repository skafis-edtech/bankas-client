<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import 'katex/dist/katex.css';
	import 'carta-md/default.css';
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { Button, ButtonGroup, Input, Helper } from 'flowbite-svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import MarkdownDisplay from '$components/forms/MarkdownDisplay.svelte';
	import type { Writable } from 'svelte/store';
	import { viewApi } from '$services/apiService';

	let skfList: string = 'SKF-';
	let problems: ProblemDisplayViewDto[] = [];
	let pdfTitle = 'Užduotys';
	let includeLink = true;
	let printAnswers = false;
	let windowLocation: string | null = null;
	let isDifferentList = false;

	const { list, setList }: { list: Writable<string>; setList: (value: string) => void } =
		getContext<any>('skfList');

	$: isDifferentList = JSON.stringify($list) !== JSON.stringify(skfList);
	//list - memory, skfList - what's displayed (can be url or memory)

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const listValue = urlParams.get('list') || '';
		skfList = listValue
			.split(' ')
			.map((item) => 'SKF-' + item)
			.join(' ');
		if (skfList === 'SKF-') {
			skfList = $list;
			updateUrl();
		}

		const problemPromises = skfList.split(' ').map((skfCode) => {
			if (skfCode) return viewApi.getProblemBySkfCode(skfCode);
			return Promise.resolve(null);
		});
		if (problemPromises.length !== 0) {
			const problemResponses = await Promise.all(problemPromises);
			problems = problemResponses
				.filter((response) => response && response.data)
				.map((response) => response?.data || ({} as ProblemDisplayViewDto));
		}

		// Accessing window only after component has been mounted
		windowLocation = window.location.href.slice(8);
	});

	function updateUrl() {
		const queryParams = new URLSearchParams(window.location.search);
		queryParams.set(
			'list',
			skfList
				.split(' ')
				.map((item) => item.replace('SKF-', ''))
				.join(' ')
		);
		const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
		history.replaceState(null, '', newUrl);
		windowLocation = window.location.href.slice(8);
	}

	function reloadPage() {
		window.location.reload();
	}
	function clearList() {
		setList('');
	}
</script>

<div class="no-print">
	<h1 class="text-4xl font-semibold my-4 text-center">Atrinktų užduočių sąrašas pagal nuorodą</h1>
	{#if skfList.length > 0}
		{#if problems.length === 0}
			<h3 class="text-center">Kraunama...</h3>
		{/if}
		{#each problems as problem, i}
			<div class="flex gap-2 my-2">
				<div class="text-sm">{i + 1}.</div>
				<div class="w-full">
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

{#if problems.length > 0}
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
{/if}

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
	<h2 class="text-3xl font-semibold my-4 text-center">Sukurtas sąrašas naršyklės atmintyje</h2>
	<p class="text-center mb-4">
		{isDifferentList
			? '(pagal nuorodą rodomas sąrašas skiriasi)'
			: '(šiuo metu yra rodomas pagal nuorodą)'}
	</p>
	<div class="relative">
		<Input bind:value={$list} />
		<Helper
			><a
				href={`https://www.skafis.lt/?skflist=${$list
					.split(' ')
					.map((item) => item.replace('SKF-', ''))
					.join('+')}#skflist`}>Eiti į skafis.lt puslapį su šiuo sąrašu</a
			>. Arba nukopijuokite šį tekstą į skafis.lt puslapyje esantį sąrašo laukelį.</Helper
		>
		<Button on:click={clearList} color="none" class="absolute right-0 top-0">❌</Button>
	</div>
	{#if isDifferentList}
		<div class="flex flex-row justify-center gap-4 mt-4">
			<Button
				on:click={() => {
					history.replaceState(null, '', '/list');
					reloadPage();
				}}
				color="blue">Atnaujinti nuorodą pagal kompiuterio atmintį</Button
			>
		</div>
	{/if}
	<p>
		<em
			>Sąrašą galite sukurti pažymėdami atskiras užduotis arba suvesdami kodus čia, atskiriant
			tarpais, pvz.: 'SKF-1 SKF-4 SKF-112'.</em
		>
		<img alt="Kur pridėti užduotį prie sąrašo" src="/tutorial1.png" class="border-2 border-black" />
	</p>
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
			/*width: 48%; /* Each column takes up about half the page */
			margin-bottom: 0;
			display: block;
			margin: 0;
			padding: 0;
			/*transform-origin: top left;
			transform: scale(0.85); /* Adjust scale to fit content within columns */
		}

		@page {
			margin: 0;
		}
	}
</style>
