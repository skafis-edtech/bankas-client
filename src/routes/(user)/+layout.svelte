<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { AuthContext } from '../../types';
	import { ROLES } from '$utils/constants';
	import { authInitialized } from '$lib/stores';
	import { Spinner } from 'flowbite-svelte';

	const { user } = getContext('authContext') as AuthContext;

	let unsubscribe: () => void;
	let isAllowedToProceed = false;

	onMount(() => {
		unsubscribe = authInitialized.subscribe((initialized) => {
			if (initialized) {
				if (!$user || ![ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes($user.role)) {
					goto(`/login?redirect=${window.location.pathname}`);
				} else {
					isAllowedToProceed = true;
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

{#if isAllowedToProceed}
	<slot />
{:else}
	<div class="flex flex-row justify-center mt-8"><Spinner /></div>
{/if}
