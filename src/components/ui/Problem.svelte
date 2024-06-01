<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import ProblemMeta from './ProblemMeta.svelte';
	import type { ProblemWithMeta } from '$services/dataService';
	export let problemAllData: ProblemWithMeta | null = null;
</script>

<Card class="mb-4 min-w-full">
	<div class="flex flex-col relative">
		<h2 class="text-xl font-bold mb-6">{problemAllData?.id}</h2>
		<ProblemMeta
			category={problemAllData?.category}
			author={problemAllData?.author}
			createdOn={problemAllData?.createdOn}
		/>
		{#if problemAllData?.problemText}
			<p class="mb-2">{problemAllData?.problemText}</p>
		{/if}
		{#if problemAllData?.problemImage}
			<div class="p-2">
				<img
					src={problemAllData?.problemImage}
					alt="Problem"
					class="max-w-full h-auto object-cover"
				/>
			</div>
		{/if}

		<details>
			<summary class="text-right">Žr. atsakymą</summary>
			{#if problemAllData?.answerText}
				<p><strong>Atsakymas:</strong></p>
				<p class="mb-2">{problemAllData?.answerText}</p>
			{/if}
			{#if problemAllData?.answerImage}
				<img
					src={problemAllData?.answerImage}
					alt="Answer "
					class="max-w-full h-auto object-cover my-2"
				/>
			{/if}
		</details>
	</div>
</Card>
