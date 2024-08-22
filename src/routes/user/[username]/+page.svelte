<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { UserSolid } from 'flowbite-svelte-icons';
	import { Button, Mark, Search } from 'flowbite-svelte';
	import type { AuthContext } from '../../../types';
	import { publicApi, userApi } from '$services/apiService';
	import MarkdownDisplay from '$components/ui/MarkdownDisplay.svelte';
	import MarkdownInput from '$components/forms/MarkdownInput.svelte';
	import type { SourceDisplayDto } from '$services/gen-client';
	import SourceWithProblems from '$components/layout/lists/SourceWithProblems.svelte';
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';

	let authContext: AuthContext | undefined;
	let user: AuthContext['user'] | undefined;
	try {
		authContext = getContext('authContext') as AuthContext;
		user = authContext?.user;
	} catch (e) {
		console.error('Failed to get auth context:', e);
	}

	let username;
	let bio = '';

	let editingState = false;
	let editedBio = '';

	let sourceSearchValue = '';

	$: username = get(page).params.username;

	onMount(async () => {
		try {
			const response = await userApi.getBio(username);
			bio = response.data.bio || ''; // Ensure bio is a string
		} catch (e) {
			console.error('Failed to load bio:', e);
			bio = '';
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
		try {
			await userApi.updateBio({ bio: editedBio });
			editingState = false;
			bio = editedBio;
		} catch (e) {
			console.error('Failed to save bio:', e);
		}
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Naudotojo informacija</h1>
<div class="flex flex-row gap-2 justify-center">
	<h3 class="text-xl font-semibold my-4">{username}</h3>
	<UserSolid class="h-6 w-6 self-center" />
</div>

{#if !editingState}
	{#if bio}
		<MarkdownDisplay value={bio} />
	{:else}
		<p>Nėra bio informacijos</p>
	{/if}
{:else}
	<form on:submit={saveEdit}>
		<MarkdownInput bind:value={editedBio} />
		<div class="flex flex-row gap-8 justify-center">
			<Button color="light" on:click={cancelEdit}>Atšaukti</Button>
			<Button color="blue" type="submit">Išsaugoti</Button>
		</div>
	</form>
{/if}
{#if username === $user?.username && !editingState}
	<div class="flex flex-row justify-center">
		<Button on:click={startEditing}>Redaguoti aprašymą (bio)</Button>
	</div>
{/if}
<h1 class="text-4xl font-semibold my-4 text-center">Šaltiniai</h1>

<SourceListPeageable searchValue={sourceSearchValue} sourcesSubset="author" author={username} />
