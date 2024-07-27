<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { UserSolid } from 'flowbite-svelte-icons';
	import { Button, Mark } from 'flowbite-svelte';
	import type { AuthContext } from '../../../types';
	import { userApi } from '$services/apiService';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';

	const { user } = getContext('authContext') as AuthContext;

	let username;
	let bio = '';

	let editingState = false;
	let editedBio = '';

	$: username = get(page).params.username;

	onMount(async () => {
		const response = await userApi.getBio(username);
		bio = response.data.bio;
	});

	function startEditing() {
		editingState = true;
		editedBio = bio;
	}

	function cancelEdit() {
		editingState = false;
	}

	async function saveEdit() {
		await userApi.updateBio({ bio: editedBio });
		editingState = false;
		bio = editedBio;
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Naudotojo informacija</h1>
<div class="flex flex-row gap-2 justify-center">
	<h3 class="text-xl font-semibold my-4">{username}</h3>
	<UserSolid class="h-6 w-6 self-center" />
</div>

{#if !editingState}
	<MarkdownDisplay value={bio} />
{:else}
	<form on:submit={() => saveEdit()}>
		<MarkdownInput bind:value={editedBio} />
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
