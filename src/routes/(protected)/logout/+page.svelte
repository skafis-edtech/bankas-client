<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$services/auth';
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { get } from 'svelte/store';

	let user: User | null = null;
	onMount(() => {
		const userState = get(currentUser);
		if (!userState) {
			goto('/login');
		} else {
			user = userState;
			logout().then(() => goto('/login'));
		}
	});
</script>

<h1>Logging out...</h1>
