<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { ROLES } from '$utils/constants';
	import ProblemSubmitted from '$components/ui/ProblemSubmitted.svelte';

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
	<h1>Submit Dashboard</h1>
	<p>Welcome, {user.username}</p>
	{#if user.role === ROLES.ADMIN}
		<p>Back to review <a href="/review-dashboard">Review dashboard</a></p>
	{/if}
	<p>Under review</p>
	<p>Approved</p>
	<ProblemSubmitted />
	<p>Upload new. <a href="/submit-new">Submit new</a></p>
{/if}

<style lang="scss">
	h1 {
		margin-top: 0;
		font-size: 1.5rem;
	}
</style>
