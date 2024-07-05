<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { UserSolid } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';
	import type { AuthContext } from '../../../types';
	import { userApi } from '$services/apiService';

	const { user } = getContext('authContext') as AuthContext;

	let username;
	let error = '';
	let loading = true;
	let bio = '';

	let editingState = false;
	let editedBio = '';

	$: username = get(page).params.username;

	onMount(async () => {
		try {
			const response = await userApi.getBio(username);
			bio = response.data.bio;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	function startEditing() {
		editingState = true;
		editedBio = bio;
	}

	function cancelEdit() {
		editingState = false;
	}

	async function saveEdit() {
		userApi
			.updateBio({ bio: editedBio })
			.then(() => {
				editingState = false;
				bio = editedBio;
			})
			.catch((e: any) => {
				error = e.message;
			});
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Naudotojo informacija</h1>
<div class="flex flex-row gap-2 justify-center">
	<h3 class="text-xl font-semibold my-4">{username}</h3>
	<UserSolid class="h-6 w-6 self-center" />
</div>

{#if loading}
	<p class="text-center">Kraunasi...</p>
{/if}
{#if error}
	<p class="text-red-600 text-center">Klaida: {error}</p>
{/if}
{#if !editingState}
	<h3 class="text-lg font-semibold my-4 text-center">{bio}</h3>
{:else}
	<form class="flex flex-col items-center" on:submit={() => saveEdit()}>
		<textarea bind:value={editedBio} class="h-32 w-10/12 p-2 border border-gray-300 rounded-md mb-4"
		></textarea>
		<div class="flex flex-row gap-8 justify-center">
			<Button color="light" on:click={cancelEdit}>Atšaukti</Button>
			<Button color="blue" type="submit">Išsaugoti</Button>
		</div>
	</form>
{/if}
{#if username === $user?.username && !editingState}
	<div class="flex flex-row justify-center">
		<Button on:click={() => startEditing()}>Redaguoti aprašymą (bio)</Button>
	</div>
{/if}
