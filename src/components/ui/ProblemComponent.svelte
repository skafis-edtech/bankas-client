<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import ProblemMeta from './ProblemMeta.svelte';

	export let problemMainData: Components.ProblemMainData;
	export let problemMetaData: Components.ProblemMetaData;
</script>

<Card class="min-w-full">
	<div class="flex flex-col relative">
		<h2 class="text-xl font-bold text-left">{problemMainData.skfCode}</h2>
		<ProblemMeta {problemMetaData} />
		{#if problemMainData.problemText}
			<p class="mb-2 text-black text-left">{problemMainData.problemText}</p>
		{/if}
		{#if problemMainData.problemImageSrc.length > 0}
			<div class="p-2">
				<img
					src={problemMainData.problemImageSrc}
					alt={`Užduoties ${problemMainData.skfCode} paveikslėlis`}
					class="max-w-full h-auto object-cover text-left"
				/>
			</div>
		{/if}

		{#if problemMainData.answerText || problemMainData.answerImageSrc.length > 0}
			<details>
				<summary class="text-right">Žr. atsakymą</summary>
				<p><strong>Atsakymas:</strong></p>
				{#if problemMainData.answerText}
					<p class="mb-2 text-black">{problemMainData.answerText}</p>
				{/if}
				{#if problemMainData.answerImageSrc.length > 0}
					<img
						src={problemMainData.answerImageSrc}
						alt={`Užduoties ${problemMainData.skfCode} atsakymo paveikslėlis`}
						class="max-w-full h-auto object-cover"
					/>
				{/if}
			</details>
		{:else}
			<p class="text-right">Atsakymas nėra pateiktas</p>
		{/if}
	</div>
</Card>
