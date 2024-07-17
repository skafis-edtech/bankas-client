<script lang="ts">
	import type { SourceSubmitDto } from '$services/gen-client';
	import { Card, Input, Label } from 'flowbite-svelte';
	import MarkdownInput from './MarkdownInput.svelte';

	export let sourceData: SourceSubmitDto;
</script>

<Card class="max-w-md mx-auto my-6 min-w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">
		Šaltinio informacija
	</h2>
	<div class="space-y-6 mt-4 mb-8">
		<div>
			<Label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Pavadinimas
			</Label>
			<Input
				id="name"
				type="text"
				bind:value={sourceData.name}
				placeholder="Šaltinio pavadinimas"
				class="mt-1 block w-full px-4 py-2 text-lg border-black dark:border-white border-2"
			/>
		</div>
		<div>
			<Label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Aprašymas
			</Label>
			<div id="description">
				<MarkdownInput bind:value={sourceData.description} />
			</div>
		</div>
	</div>
</Card>
