<script lang="ts">
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import SourceReviewBar from '$components/ui/SourceReviewBar.svelte';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>
<SourceReviewBar reviewStatus={SourceReviewStatusEnum.Approved} />
