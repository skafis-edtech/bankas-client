<script lang="ts">
	import { Card, Input, Label } from 'flowbite-svelte';
	import type { Components } from '../../types';

	export let sourceData: Components.SourceCreateFormData;
</script>

<Card class="max-w-md mx-auto my-6 min-w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">
		Šaltinio informacija
	</h2>
	<div class="space-y-6 my-4">
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
			<textarea
				id="description"
				rows="4"
				class="mt-1 block px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Šaltinio aprašymas"
				bind:value={sourceData.description}
			></textarea>
		</div>
	</div>
</Card>
