<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores';
</script>

<header>
	{#if $currentUser}
		<p>Welcome, {$currentUser.username}</p>
		<button on:click={() => goto('/logout')}>Logout</button>
	{:else}
		<button on:click={() => goto('/login')}>Login</button>
	{/if}
</header>
