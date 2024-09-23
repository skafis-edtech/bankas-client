<script lang="ts">
	import type { SourceSubmitDto } from '$services/gen-client';
	import { Input, Label } from 'flowbite-svelte';
	import MarkdownInput from './MarkdownInput.svelte';

	export let sourceData: SourceSubmitDto;
</script>

<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">
	Šaltinio informacija
</h2>
<div class="space-y-6 mt-4 mb-8">
	<div>
		<Label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Pilnas pavadinimas
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
	<div class="w-full">
		<Label for="visibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Užduočių matomumas
		</Label>
		<select
			id="visibility"
			bind:value={sourceData.visibility}
			class="mt-1 block px-4 py-2 text-lg border-black dark:border-white border-2 w-full"
		>
			<option value="private">Privačios</option>
			<option value="public">Viešos</option>
		</select>
	</div>
</div>
