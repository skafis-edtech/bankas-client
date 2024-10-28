<script lang="ts">
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { viewApi } from '$services/apiService';
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { Button, Input } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	let skfCode = writable('SKF-');

	let problemDisplayViewDto: ProblemDisplayViewDto | null = null;

	const fetchStuff = async () => {
		const response = await viewApi.getProblemBySkfCode($skfCode);
		problemDisplayViewDto = response.data;
	};
</script>

<div class="flex flex-col my-8 container mx-auto">
	<p class="text-center text-sm my-0">
		Rodyti užduotį su redagavimo tekstu (kopijavimui) pagal SKF kodą
	</p>

	<form
		on:submit|preventDefault={() => fetchStuff()}
		class="flex flex-row max-w-min justify-center items-center m-auto"
	>
		<Input
			type="text"
			id="skf-code"
			bind:value={$skfCode}
			on:input={() => {
				if ($skfCode.slice(0, 4) !== 'SKF-') {
					skfCode.set('SKF-');
				}
				const numericPart = $skfCode.slice(4).replace(/\D/g, '');
				skfCode.set('SKF-' + numericPart);
			}}
			required
			placeholder="SKF-"
			class="block px-4 py-2 text-lg w-32 m-auto my-4"
			autocomplete="off"
		/>
		<Button class="ml-3 py-3" type="submit">Rodyti</Button>
	</form>
	{#if problemDisplayViewDto}
		<ProblemComponent
			problemMainData={{
				skfCode: problemDisplayViewDto.skfCode,
				problemText: problemDisplayViewDto.problemText,
				problemImageSrc: problemDisplayViewDto.problemImageSrc,
				answerText: problemDisplayViewDto.answerText,
				answerImageSrc: problemDisplayViewDto.answerImageSrc,
				categories: problemDisplayViewDto.categories,
				sourceId: problemDisplayViewDto.sourceId,
				visibility: problemDisplayViewDto.problemVisibility
			}}
		/>
		<p>Užduoties redagavimo tekstas</p>
		<MarkdownInput value={problemDisplayViewDto.problemText} />
		<details>
			<summary>Atsakymo redagavimo tekstas </summary>
			<MarkdownInput value={problemDisplayViewDto.answerText} />
		</details>
	{/if}
</div>
