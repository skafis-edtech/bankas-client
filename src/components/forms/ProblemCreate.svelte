<script lang="ts">
	import type { ProblemFullWithFiles } from '$services/dataService';
	import { Card } from 'flowbite-svelte';
	import { type Writable } from 'svelte/store';

	export let problemData: Writable<ProblemFullWithFiles>;
</script>

<Card class="my-6 min-w-full">
	<div class="flex flex-col relative">
		<input
			type="text"
			bind:value={$problemData.problemText}
			placeholder="Problem Text"
			class="mb-2 p-2 border"
		/>
		<input
			type="text"
			bind:value={$problemData.answerText}
			placeholder="Answer Text"
			class="mb-2 p-2 border"
		/>
	</div>
</Card>
