<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let user: User | null = null;

	onMount(() => {
		const userState = get(currentUser);
		if (!userState || userState.role !== 'admin') {
			goto('/submit-dashboard');
		} else {
			user = userState;
		}
	});
</script>

{#if user}
	<h1>Admin Dashboard</h1>
	<p>Welcome, {user.username}</p>
{/if}
