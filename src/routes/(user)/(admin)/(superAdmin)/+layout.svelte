<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { AuthContext } from '../../../../types';
	import { ROLES } from '$utils/constants';
	import { authInitialized } from '$lib/stores';

	const { user } = getContext('authContext') as AuthContext;

	let unsubscribe: () => void;

	onMount(() => {
		unsubscribe = authInitialized.subscribe((initialized) => {
			if (initialized) {
				if (!$user || ![ROLES.SUPER_ADMIN].includes($user.role)) {
					goto(`/login?redirect=${window.location.pathname}`);
				}
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<slot />
