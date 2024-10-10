<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$services/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	const redirectUrl: string | null = $page.url.searchParams.get('redirect');

	onMount(() => {
		document.cookie =
			'jwt=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.skafis.lt; secure; samesite=None;';
		logout().then(() => {
			if (redirectUrl) {
				if (redirectUrl === 'https://www.skafis.lt') {
					window.location.href = redirectUrl;
				} else {
					goto(redirectUrl);
				}
			} else {
				goto('/login');
			}
		});
	});
</script>

<h1>Atsijungiama..</h1>
