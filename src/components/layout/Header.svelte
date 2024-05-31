<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores';
</script>

<p>By using this website you agree with Google Analytics cookie usage</p>
<button on:click={() => goto('/')}>Home</button>
{#if $currentUser}
	<p>Welcome, {$currentUser.username}</p>
	<button on:click={() => goto('/dashboard')}>Dashboard</button>
	<button on:click={() => goto('/logout')}>Logout</button>
{:else}
	<button on:click={() => goto('/login')}>Login</button>
{/if}
