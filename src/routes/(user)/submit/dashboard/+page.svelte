<script lang="ts">
	import { goto } from '$app/navigation';
	import SourceWithProblems from '$components/layout/SourceWithProblems.svelte';
	import SourceManageBar from '$components/ui/SourceManageBar.svelte';
	import { approvalApi } from '$services/apiService';
	import type { Source, SourceDisplayDto, SourceReviewStatusEnum } from '$services/gen-client';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let sources: SourceDisplayDto[] = [];

	onMount(async () => {
		const response = await approvalApi.getMySources();
		const groupedSources: Record<SourceReviewStatusEnum, SourceDisplayDto[]> = {
			REJECTED: [],
			PENDING: [],
			APPROVED: []
		};
		response.data.forEach((source) => {
			const reviewStatus = source.reviewStatus;
			if (!groupedSources[reviewStatus]) {
				groupedSources[reviewStatus] = [];
			}
			groupedSources[reviewStatus].push(source);
		});
		sources = Object.values(groupedSources).flat() as SourceDisplayDto[];
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių pateikimas</h1>
{#each sources as source (source.id)}
	<SourceManageBar
		reviewStatus={source.reviewStatus}
		sourceId={source.id}
		reviewMessage={source.reviewMessage}
		reviewedOn={source.reviewedOn}
		reviewedBy={source.reviewedByUsername}
	/>
	<SourceWithProblems {source} />
{/each}
<Button color="green" on:click={() => goto('/submit/new-source')} class="w-full"
	>Pridėti užduočių rinkinį</Button
>
