<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$services/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		logout().then(() => goto('/login'));
	});
</script>

<h1>Atsijungiama..</h1>
