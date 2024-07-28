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
		/>
		<details>
			<summary>Pridėti atsakymą bei kitus komentarus</summary>
			<ImageUploadTextarea
				bind:value={problemData.answerText}
				bind:imageFile={problemData.answerImageFile}
				label="Atsakymas bei kiti komentarai"
			/>
		</details>
	</div>
</Card>
