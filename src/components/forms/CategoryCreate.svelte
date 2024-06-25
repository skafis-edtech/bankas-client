<script lang="ts">
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import { writable, type Writable } from 'svelte/store';
	import { type CategoryPostDto } from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import { onMount } from 'svelte';

	let category: Writable<CategoryPostDto> = writable({} as CategoryPostDto);
	export let createState: Writable<boolean>;
	export let operationDone: Writable<boolean>;

	onMount(() => {
		operationDone.set(false);
	});

	const handleSubmit = async () => {
		await categoryApi.submitCategory($category);
		createState.set(false);
		operationDone.set(true);
	};

	const cancelEdit = () => {
		createState.set(false);
	};
</script>

<Card class="max-w-md mx-auto my-6 min-w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">Nauja kategorija</h2>
	<div class="space-y-6 my-4">
		<div>
			<Label for="categoryName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Pavadinimas
			</Label>
			<Input
				id="categoryName"
				type="text"
				bind:value={$category.name}
				placeholder="Kategorijos pavadinimas"
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label
				for="categoryDescription"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
				Aprašymas
			</Label>
			<textarea
				id="categoryDescription"
				rows="4"
				class="mt-1 block px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Kategorijos aprašymas"
				bind:value={$category.description}
			></textarea>
		</div>
		<div class="flex flex-row gap-8 justify-center">
			<Button color="light" on:click={cancelEdit}>Atšaukti</Button>
			<Button color="blue" on:click={handleSubmit}>Pateikti</Button>
		</div>
	</div>
</Card>
