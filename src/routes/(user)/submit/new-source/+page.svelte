<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import SourceCreateForm from '$components/forms/SourceCreateForm.svelte';
	import { approvalApi } from '$services/apiService';
	import type { SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';

	let sourceData: SourceSubmitDto = {
		name: '',
		description: ''
	};
	let subject = 'Matematika';
	let name = '';
	let status = 'DAR TVARKOMA';
	$: sourceData.name = `${subject}. ${name}${status !== '' ? ' (' + status + ')' : ''}`;

	async function submitSource() {
		if (name === '') {
			alert('Pavadinimas privalomas');
			return;
		}
		if (subject === '') {
			alert('Dalykas privalomas');
			return;
		}
		const idResponse = await approvalApi.submitSourceData(sourceData);
		successStore.set('Šaltinis pateiktas sėkmingai');
		goto(`/submit/edit-source/${idResponse.data.id}`);
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Naujas šaltinis</h1>
<div class="flex flex-row justify-between mx-4">
	<div class="w-28">
		<Button on:click={() => goto('/submit/dashboard')} class="w-16">Grįžti</Button>
	</div>
	<div>
		<h3 class="text-lg text-center">
			Pirmiausia pateikite šaltinio (užduočių rinkinio) pavadinimą, tuomet galėsite pridėti
			užduotis.
		</h3>
		<!-- <h3 class="text-lg text-blue-600 text-center">
			Vos pateikę užduotis galite jas rūšiuoti į kategorijas!
		</h3> -->
	</div>

	<div class="w-28">
		<!-- <Button color="blue" on:click={() => goto('/sort-dashboard')} class="w-28">Rūšiuoti</Button> -->
	</div>
</div>

<div class="relative">
	<div class="space-y-6 mt-4 mb-8">
		<div class="flex flex-row gap-4 justify-center">
			<div class="flex-2">
				<Label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Dalykas
				</Label>
				<Input
					disabled
					id="subject"
					type="text"
					bind:value={subject}
					placeholder="Dalykas"
					class="mt-1 block w-full px-4 py-2 text-lg border-black dark:border-white border-2"
				/>
			</div>
			<div class="flex-1">
				<Label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Šaltinio pavadinimas
				</Label>
				<Input
					id="name"
					type="text"
					bind:value={name}
					placeholder="Šaltinio pavadinimas"
					class="mt-1 block w-full px-4 py-2 text-lg border-black dark:border-white border-2"
				/>
			</div>

			<div class="flex-2">
				<Label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Statusas (ištrinkite įkėlę užduotis)
				</Label>
				<Input
					disabled
					id="status"
					type="text"
					bind:value={status}
					placeholder="Statusas"
					class="mt-1 block w-full px-4 py-2 text-lg border-black dark:border-white border-2"
				/>
			</div>
		</div>
	</div>
	<div class="flex justify-center">
		<Button color="purple" on:click={submitSource} class="w-fit">Pridėti užduočių sąrašą</Button>
	</div>
</div>
