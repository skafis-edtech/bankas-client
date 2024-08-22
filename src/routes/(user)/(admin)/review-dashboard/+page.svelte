<script lang="ts">
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';
	let searchSourcesValue = '';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>

<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="all" />
