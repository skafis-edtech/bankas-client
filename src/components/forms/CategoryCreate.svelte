<script lang="ts">
	import { Card, Input, Label } from 'flowbite-svelte';
	import { writable, type Writable } from 'svelte/store';

	// export let category: Writable<CategoryForDatabase>;
	export let category: Writable<any> = writable({} as any);
</script>

<Card class="max-w-md mx-auto my-6 min-w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">Category</h2>
	<div class="space-y-6 my-4">
		<div>
			<Label for="categoryName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Category name
			</Label>
			<Input
				id="categoryName"
				type="text"
				bind:value={$category.name}
				placeholder="Category name"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label
				for="categoryDescription"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
				Category description
			</Label>
			<textarea
				id="categoryDescription"
				rows="4"
				class="mt-1 block px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Category description"
				bind:value={$category.description}
			></textarea>
		</div>
	</div>
</Card>
