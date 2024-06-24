<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryCreate from '$components/forms/CategoryCreate.svelte';
	import { currentUser } from '$lib/stores';
	import type { CategoryPostDto } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let category: Writable<CategoryPostDto> = writable({} as CategoryPostDto);
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Pridėkite naują kategoriją</h1>
	<p class="text-red-600 text-center">Pakeitimai nėra išsaugomi automatiškai!</p>
	<Button
		on:click={() => {
			if (confirm('Ar tikrai norite grįžti? Pakeitimai nebus išsaugoti.')) {
				goto('/submit-dashboard');
			}
		}}
		class="ml-4">Grįžti</Button
	>
	<CategoryCreate {category} />
{:else}
	<p>Unauthorized</p>
{/if}
