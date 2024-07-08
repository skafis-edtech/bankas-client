<script lang="ts">
	import { categoryApi } from '$services/apiService';
	import type { Category, CategoryPostDto } from '$services/gen-client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let categories = writable<Category[]>([]);
	let newCategory: CategoryPostDto = { name: '', description: '' };
	let editCategory: Category | null = null;
	let errorMessage = '';

	const fetchCategories = async () => {
		try {
			const response = await categoryApi.getAllCategories();
			categories.set(response.data);
		} catch (error) {
			errorMessage = 'Failed to fetch categories';
			console.error(error);
		}
	};

	const createCategory = async () => {
		try {
			await categoryApi.createCategory(newCategory);
			newCategory = { name: '', description: '' };
			fetchCategories();
		} catch (error) {
			errorMessage = 'Failed to create category';
			console.error(error);
		}
	};

	const updateCategory = async () => {
		try {
			if (editCategory) {
				await categoryApi.updateCategory1(editCategory.id, editCategory);
				editCategory = null;
				fetchCategories();
			}
		} catch (error) {
			errorMessage = 'Failed to update category';
			console.error(error);
		}
	};

	const deleteCategory = async (id: string) => {
		try {
			await categoryApi.deleteCategory(id);
			fetchCategories();
		} catch (error) {
			errorMessage = 'Failed to delete category';
			console.error(error);
		}
	};

	onMount(fetchCategories);
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Manage firestore categories</h1>

{#if errorMessage}
	<div class="bg-red-500 text-white p-4 rounded">
		{errorMessage}
	</div>
{/if}

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Categories</h2>
	{#each $categories as category (category.id)}
		<div class="p-4 bg-white rounded shadow mb-4">
			{#if editCategory && editCategory.id === category.id}
				<form on:submit|preventDefault={updateCategory}>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700" for="name">Name</label>
						<input
							id="name"
							type="text"
							bind:value={editCategory.name}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700" for="description"
							>Description</label
						>
						<input
							id="description"
							type="text"
							bind:value={editCategory.description}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
					<button
						type="button"
						on:click={() => (editCategory = null)}
						class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button
					>
				</form>
			{:else}
				<div class="flex justify-between items-center">
					<div>
						<h3 class="text-lg font-semibold">{category.id}</h3>
						<p class="text-gray-600"><strong>Name: </strong>{category.name}</p>
						<p class="text-gray-600"><strong>Description: </strong>{category.description}</p>
					</div>
					<div>
						<button
							on:click={() => (editCategory = { ...category })}
							class="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button
						>
						<button
							on:click={() => deleteCategory(category.id)}
							class="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button
						>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Create Category</h2>
	<form on:submit|preventDefault={createCategory}>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="name">Name</label>
			<input
				id="name"
				type="text"
				bind:value={newCategory.name}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="description">Description</label>
			<input
				id="description"
				type="text"
				bind:value={newCategory.description}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
	</form>
</div>
