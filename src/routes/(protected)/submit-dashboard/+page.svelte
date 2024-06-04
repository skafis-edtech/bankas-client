<script lang="ts">
	import { ROLES } from '$utils/constants';
	import ProblemSubmitted from '$components/ui/ProblemSubmitted.svelte';
	import { currentUser } from '$lib/stores';
</script>

{#if $currentUser}
	<h1>Submit Dashboard</h1>
	<p>Welcome, {$currentUser.username}</p>
	{#if $currentUser.role !== ROLES.ADMIN}
		<p>
			Want to review others? Email <a href="mailto:naglis.suliokas@gmail.com"
				>naglis.suliokas@gmail.com</a
			> to get access!
		</p>
	{/if}
	<p>Under review</p>
	<p>Approved</p>
	<ProblemSubmitted />
	<p>Upload new. <a href="/submit-new">Submit new</a></p>
{:else}
	<p>Unauthorized</p>
{/if}

<style lang="scss">
	h1 {
		margin-top: 0;
		font-size: 1.5rem;
	}
</style>
