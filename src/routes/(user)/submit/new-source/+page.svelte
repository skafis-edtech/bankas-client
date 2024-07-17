<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import { approvalApi } from '$services/apiService';
	import type { SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';

	let isSourceSubmitted = false;

	let submittedSource: SourceSubmitDto;

	let isSourceDataChanged = false;
	$: {
		isSourceDataChanged =
			submittedSource?.name !== sourceData?.name ||
			submittedSource?.description !== sourceData?.description;
	}

	let sourceData: SourceSubmitDto = {
		name: '',
		description: ''
	};

	async function submitSource() {
		const idResponse = await approvalApi.submitSourceData(sourceData);
		isSourceSubmitted = true;
		successStore.set('Šaltinis pateiktas sėkmingai');
		goto(`/submit/edit-source/${idResponse.data.id}`);
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių rinkinio įkėlimas</h1>
<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit/dashboard')} class="w-16">Grįžti</Button>
	</div>
	<div>
		<h3 class="text-lg text-red-600 text-center">Progresas nėra išsaugomas automatiškai!</h3>
		<h3 class="text-lg text-blue-600 text-center">
			Vos pateikę užduotis galite jas rūšiuoti į kategorijas!
		</h3>
	</div>

	<div class="w-28">
		<Button color="blue" on:click={() => goto('/sort-dashboard')} class="w-28">Rūšiuoti</Button>
	</div>
</div>

<div class="relative">
	<SourceCreateForm bind:sourceData />
	<Button color="purple" on:click={submitSource} class="w-fit absolute right-2 bottom-2"
		>Pateikti peržiūrai</Button
	>
</div>
