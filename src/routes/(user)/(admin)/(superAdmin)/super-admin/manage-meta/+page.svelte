<script lang="ts">
	import { successStore } from '$lib/stores';
	import { problemApi } from '$services/apiService';
	import { Button } from 'flowbite-svelte';

	const initMeta = async () => {
		await problemApi.initMeta();
		successStore.set('Meta repo set to SKF-0');
	};
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Manage firestore meta</h1>
<Button on:click={initMeta} class="bg-red-800 text-white px-4 py-2 rounded mt-24"
	>Clear usedSfkCodes field</Button
>
