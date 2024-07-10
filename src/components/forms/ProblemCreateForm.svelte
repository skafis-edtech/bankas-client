<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import type { Components } from '../../types';
	import ImageUploadTextarea from './ImageUploadTextarea.svelte';

	export let problemData: Components.ProblemCreateFormData;
	export let index: number;
</script>

<Card class="my-6 min-w-full">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">
		Užduotis {index + 1}
	</h2>
	<div class="flex flex-col relative mb-8">
		<ImageUploadTextarea
			bind:value={problemData.problemText}
			bind:imageFile={problemData.problemImageFile}
			bind:imageUrl={problemData.problemImageUrl}
			label="Klausimas"
			id="question"
			textareaClass="border-black dark:border-white border-2 h-32"
		/>
		<ImageUploadTextarea
			bind:value={problemData.answerText}
			bind:imageFile={problemData.answerImageFile}
			bind:imageUrl={problemData.answerImageUrl}
			label="Atsakymas"
			id="answer"
			textareaClass="border-gray-300"
		/>
	</div>
</Card>
