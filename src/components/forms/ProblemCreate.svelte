<script lang="ts">
	import ImageUploadTextarea from '$components/ui/ImageUploadTextarea.svelte';
	import type { ProblemPostDto, ProblemPostDtoOld } from '$services/gen-client';
	import { Card } from 'flowbite-svelte';
	import { type Writable } from 'svelte/store';

	export let problemData: Writable<ProblemPostDtoOld>;
	export let problemImageFile: Writable<File | null>;
	export let answerImageFile: Writable<File | null>;
</script>

<Card class="my-6 min-w-full">
	<div class="flex flex-col relative">
		<div class="flex flex-col relative">
			<ImageUploadTextarea
				bind:value={$problemData.problemText}
				bind:imageFile={$problemImageFile}
				label="Klausimas"
				id="question"
			/>
			<ImageUploadTextarea
				bind:value={$problemData.answerText}
				bind:imageFile={$answerImageFile}
				label="Atsakymas"
				id="answer"
			/>
		</div>
	</div>
</Card>
