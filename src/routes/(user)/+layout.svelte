<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../types';
	import { ROLES } from '$utils/constants';
	import { authInitialized } from '$lib/stores';

	const { user } = getContext('authContext') as AuthContext;

	onMount(() => {
		const unsubscribe = authInitialized.subscribe((initialized) => {
			if (initialized) {
				if (!$user || ![ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes($user.role)) {
					goto('/login');
				}
				unsubscribe();
			}
		});
	});
</script>

<slot />
