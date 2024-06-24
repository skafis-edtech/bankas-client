<script lang="ts">
	import { currentUser, type User } from '$lib/stores';

	import ProblemToReview from '$components/ui/ProblemToReview.svelte';
	import { ROLES } from '$utils/constants';
</script>

{#if $currentUser && $currentUser.role === ROLES.ADMIN}
	<h1 class="text-4xl font-semibold my-4 text-center">Uždavinių peržiūra</h1>
{:else}
	<p>Unauthorized</p>
{/if}
