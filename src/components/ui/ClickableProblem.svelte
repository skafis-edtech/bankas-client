<script lang="ts">
	import type { ProblemDisplayViewDto } from '$services/gen-client';
	import { Badge } from 'flowbite-svelte';
	import ProblemComponent from './ProblemComponent.svelte';

	export let problem: ProblemDisplayViewDto;
	export let shadeColorStr: string;
	export let onClick: () => void;
	export let isClicked: boolean = false;
</script>

<button
	on:click={() => {
		onClick();
		isClicked = true;
	}}
	class="my-4 rounded-lg relative w-full"
>
	{#if isClicked}
		<div class="absolute inset-0 border-black border-4 rounded-lg"></div>
	{/if}
	<div class={`absolute inset-0 ${shadeColorStr} opacity-20 pointer-events-none rounded-lg`}></div>
	{#if shadeColorStr !== 'transparent'}
		<Badge class="w-fit z-9 absolute top-8">
			<p class="text-center">
				{shadeColorStr === 'bg-gray-500'
					? 'KITO naudotojo. Nesurūšiuota'
					: shadeColorStr === 'bg-green-500'
						? 'Jau surūšiuota'
						: shadeColorStr === 'bg-red-500'
							? 'KITO naudotojo. Jau surūšiuota'
							: ''}
			</p>
		</Badge>
	{/if}
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
</button>
