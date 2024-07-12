<script lang="ts">
	import SourceWithProblems from '$components/layout/SourceWithProblems.svelte';
	import SourceReviewBar from '$components/ui/SourceReviewBar.svelte';
	import { approvalApi } from '$services/apiService';
	import type { Source, SourceReviewStatusEnum } from '$services/gen-client';
	import { onMount } from 'svelte';

	let sources: Source[] = [];

	onMount(async () => {
		const response = await approvalApi.getSources();
		const groupedSources: Record<SourceReviewStatusEnum, Source[]> = {
			PENDING: [],
			REJECTED: [],
			APPROVED: []
		};
		response.data.forEach((source) => {
			const reviewStatus = source.reviewStatus;
			if (!groupedSources[reviewStatus]) {
				groupedSources[reviewStatus] = [];
			}
			groupedSources[reviewStatus].push(source);
		});
		sources = Object.values(groupedSources).flat() as Source[];
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>
{#each sources as source (source.id)}
	<SourceReviewBar
		reviewStatus={source.reviewStatus}
		sourceId={source.id}
		reviewMessage={source.reviewMessage}
		reviewedOn={source.reviewedOn}
		reviewedBy={source.reviewedBy}
	/>
	<SourceWithProblems {source} />
{/each}
