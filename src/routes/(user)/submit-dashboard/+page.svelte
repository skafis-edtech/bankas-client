<script lang="ts">
	import { goto } from '$app/navigation';
	import SourceWithProblems from '$components/layout/SourceWithProblems.svelte';
	import SourceManageBar from '$components/ui/SourceManageBar.svelte';
	import { approvalApi } from '$services/apiService';
	import type { Source } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let sources: Source[] = [];

	onMount(async () => {
		const response = await approvalApi.getMySources();
		sources = response.data;
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių pateikimas</h1>
{#each sources as source (source.id)}
	<SourceManageBar reviewStatus={source.reviewStatus} />
	<SourceWithProblems {source} />
{/each}
<Button color="green" on:click={() => goto('/submit-new-source')} class="w-full"
	>Pridėti užduočių rinkinį</Button
>
