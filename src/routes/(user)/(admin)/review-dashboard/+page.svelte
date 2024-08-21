<script lang="ts">
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';
	import SourceReviewBar from '$components/ui/SourceReviewBar.svelte';
	import { approvalApi } from '$services/apiService';
	import type { SourceDisplayDto, SourceReviewStatusEnum } from '$services/gen-client';
	import { onMount } from 'svelte';

	let sources: SourceDisplayDto[] = [];
	let searchSourcesValue = '';

	onMount(async () => {
		const response = await approvalApi.getSources();
		const groupedSources: Record<SourceReviewStatusEnum, SourceDisplayDto[]> = {
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
		sources = Object.values(groupedSources).flat() as SourceDisplayDto[];
	});
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>

<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="all" />
