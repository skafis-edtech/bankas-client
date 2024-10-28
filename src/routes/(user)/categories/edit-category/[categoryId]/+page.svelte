<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import {
		CategoryVisibilityEnum,
		type Category,
		type CategoryPostDto
	} from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import { categoryApi, categoryViewApi } from '$services/apiService';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../../../../types';
	import { ROLES } from '$utils/constants';
	import { page } from '$app/stores';

	let categoryId: string;
	$: categoryId = $page.params.categoryId;

	let oldData: Category;

	let categoryData: CategoryPostDto = {
		name: '',
		description: '',
		visibility: CategoryVisibilityEnum.Private
	};

	onMount(async () => {
		const response = await categoryViewApi.getCategoryById(categoryId);
		oldData = response.data;
		if (oldData) {
			categoryData = {
				name: oldData.name,
				description: oldData.description,
				visibility: oldData.visibility
			};
		}
	});

	let dataChanged = false;
	$: {
		if (oldData) {
			dataChanged =
				oldData.name !== categoryData.name ||
				oldData.description !== categoryData.description ||
				oldData.visibility !== categoryData.visibility;
		}
	}

	async function updateSource() {
		if (categoryData.name === '') {
			alert('Pavadinimas privalomas');
			return;
		}
		const idResponse = await categoryApi.updateCategory(categoryId, categoryData);
		successStore.set('Kategorija atnaujinta sėkmingai');
		goto('/categories/dashboard');
	}

	const { user } = getContext('authContext') as AuthContext;
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Kategorijos redagavimas</h1>

<div class="flex justify-center">
	<div class="w-full">
		<Label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Kategorijos pavadinimas
		</Label>
		<Input
			id="name"
			type="text"
			bind:value={categoryData.name}
			placeholder="Kategorijos pavadinimas"
			class="mt-1 block  px-4 py-2 text-lg border-black dark:border-white border-2"
		/>

		<Label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Aprašymas
		</Label>
		<MarkdownInput bind:value={categoryData.description} />

		<div class="w-full mt-4">
			<Label for="visibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Matomumas
			</Label>
			<select
				disabled={$user.role !== ROLES.SUPER_ADMIN}
				id="visibility"
				bind:value={categoryData.visibility}
				class={`mt-1 block w-full px-4 py-2 text-lg border-black dark:border-white border-2 ${
					$user.role !== ROLES.SUPER_ADMIN ? 'bg-gray-200 border-gray-50' : ''
				}`}
			>
				<option value={CategoryVisibilityEnum.Private}>Privatus</option>
				<option value={CategoryVisibilityEnum.Public}>Viešas</option>
			</select>
		</div>
	</div>
</div>

<div class="flex justify-center mt-4">
	<Button color="purple" disabled={!dataChanged} on:click={updateSource} class="w-fit"
		>Išsaugoti ir grįžti</Button
	>
</div>
