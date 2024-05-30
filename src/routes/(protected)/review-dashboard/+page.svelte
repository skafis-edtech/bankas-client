<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { ROLES } from '$utils/constants';
	import ProblemToReview from '$components/ui/ProblemToReview.svelte';

	let user: User | null = null;

	onMount(() => {
		const userState = get(currentUser);
		if (!userState || userState.role !== ROLES.ADMIN) {
			goto('/submit-dashboard');
		} else {
			user = userState;
		}
	});
</script>

{#if user}
	<h1>Admin Dashboard</h1>
	<p>Welcome, {user.username}</p>
	<p>Review</p>
	<ProblemToReview />
	<p>Upload yours. <a href="/submit-dashboard">Submit dashboard</a></p>
{/if}
