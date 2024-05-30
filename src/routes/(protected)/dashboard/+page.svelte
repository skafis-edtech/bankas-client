<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { ROLES } from '$utils/constants';

	let user: User | null = null;

	onMount(() => {
		const userState = get(currentUser);
		if (!userState) {
			goto('/login');
		} else {
			user = userState;
			if (user.role === ROLES.ADMIN) {
				goto('/review-dashboard');
			} else if (user.role === ROLES.USER) {
				goto('/submit-dashboard');
			} else {
				throw new Error('Invalid role' + user.role);
			}
		}
	});
</script>

{#if user}
	<h1>Dashboard. Redirecting...</h1>
{/if}
