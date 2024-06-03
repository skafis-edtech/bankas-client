<script lang="ts">
	import { currentUser, type User } from '$lib/stores';

	import ProblemToReview from '$components/ui/ProblemToReview.svelte';
	import { ROLES } from '$utils/constants';
</script>

{#if $currentUser && $currentUser.role === ROLES.ADMIN}
	<h1>Admin Dashboard</h1>
	<p>Welcome, {$currentUser.username}</p>
	<p>Review</p>
	<ProblemToReview />
{:else}
	<p>Unauthorized</p>
{/if}
