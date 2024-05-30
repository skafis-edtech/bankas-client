<script>
	import { goto } from '$app/navigation';
	import { logout } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => logout().then(() => goto('/login')));
</script>

<h1>Logging out...</h1>
