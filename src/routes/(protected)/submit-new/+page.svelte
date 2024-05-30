<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let user: User | null = null;

	onMount(() => {
		const userState = get(currentUser);
		if (!userState) {
			goto('/login');
		} else {
			user = userState;
		}
	});
</script>

{#if user}
	<h1>new</h1>
	<p>Welcome, {user.username}</p>
{/if}
