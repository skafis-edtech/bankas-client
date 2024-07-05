<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../../../types';
	import { ROLES } from '$utils/constants';

	const { user } = getContext('authContext') as AuthContext;

	onMount(() => {
		if (!$user || ![ROLES.SUPER_ADMIN].includes($user.role)) {
			goto('/login');
		}
	});
</script>

<slot />
