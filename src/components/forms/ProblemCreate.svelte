<script lang="ts">
	import ImageUploadTextarea from '$components/ui/ImageUploadTextarea.svelte';
	import type { ProblemFullWithFiles } from '$services/dataService';
	import { Card } from 'flowbite-svelte';
	import { type Writable } from 'svelte/store';

	export let problemData: Writable<ProblemFullWithFiles>;
</script>

<Card class="my-6 min-w-full">
	<div class="flex flex-col relative">
		<div class="flex flex-col relative">
			<ImageUploadTextarea
				bind:value={$problemData.problemText}
				bind:uploadedImage={$problemData.problemImage}
				bind:imageFile={$problemData.problemImageFile}
				label="Question"
				id="question"
			/>
			<ImageUploadTextarea
				bind:value={$problemData.answerText}
				bind:uploadedImage={$problemData.answerImage}
				bind:imageFile={$problemData.answerImageFile}
				label="Answer"
				id="answer"
			/>
		</div>
	</div>
</Card>
