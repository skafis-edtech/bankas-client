<script lang="ts">
	import { goto } from '$app/navigation';
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';
	import { Button } from 'flowbite-svelte';

	let searchSourcesValue = '';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių pateikimas</h1>
<Button color="green" on:click={() => goto('/submit/new-source')} class="w-full my-4"
	>Pridėti šaltinį (užduočių rinkinį)</Button
>

<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="mine" />
