<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { publicApi } from '$services/apiService';
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { Button, Input } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	let skfCode = writable('SKF-');

	let problemDisplayViewDto: ProblemDisplayViewDto | null = null;

	const fetchStuff = async () => {
		const response = await publicApi.getProblemBySkfCode($skfCode);
		problemDisplayViewDto = response.data;
	};
</script>

<div class="flex flex-col my-8 container mx-auto">
	<p class="text-center text-sm my-0">Rodyti užduotį pagal SKF kodą</p>

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
		<div class="flex justify-end">
			<Button
				color="red"
				class="w-28 mb-2"
				on:click={() => {
					problemDisplayViewDto = null;
				}}>Uždaryti</Button
			>
		</div>
		<ProblemComponent
			problemMainData={{
				skfCode: problemDisplayViewDto.skfCode,
				problemText: problemDisplayViewDto.problemText,
				problemImageSrc: problemDisplayViewDto.problemImageSrc,
				answerText: problemDisplayViewDto.answerText,
				answerImageSrc: problemDisplayViewDto.answerImageSrc,
				categories: problemDisplayViewDto.categories,
				sourceId: problemDisplayViewDto.sourceId
			}}
		/>
	{/if}
</div>
