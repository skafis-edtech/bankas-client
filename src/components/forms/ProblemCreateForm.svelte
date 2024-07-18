<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import type { Components } from '../../types';
	import ImageUploadTextarea from './ImageUploadTextarea.svelte';

	export let problemData: Components.ProblemCreateFormData;
</script>

<Card class="my-6 min-w-full">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">
		Užduotis {problemData.sourceListNr}
	</h2>
	<div class="flex flex-col relative mb-8">
		<ImageUploadTextarea
			bind:value={problemData.problemText}
			bind:imageFile={problemData.problemImageFile}
			label="Klausimas"
			id="question"
			textareaClass="border-black dark:border-white border-2 h-32"
		/>
		<details>
			<summary>Pridėti atsakymą bei kitus komentarus</summary>
			<ImageUploadTextarea
				bind:value={problemData.answerText}
				bind:imageFile={problemData.answerImageFile}
				label="Atsakymas bei kiti komentarai"
				id="answer"
				textareaClass="border-gray-300"
			/>
		</details>
	</div>
</Card>
