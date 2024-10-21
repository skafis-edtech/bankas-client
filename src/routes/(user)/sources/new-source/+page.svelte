<script lang="ts">
	import { Button, Input, Label, Helper } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { SourceSubmitDtoVisibilityEnum, type SourceSubmitDto } from '$services/gen-client';
	import { successStore } from '$lib/stores';
	import { contentApi } from '$services/apiService';

	let sourceData: SourceSubmitDto = {
		name: '',
		description: '',
		visibility: SourceSubmitDtoVisibilityEnum.Private
	};
	let subject = 'Matematika';
	let name = '';
	$: sourceData.name = `${subject}. ${name}`;

	async function submitSource() {
		if (name === '') {
			alert('Pavadinimas privalomas');
			return;
		}
		if (subject === '') {
			alert('Dalykas privalomas');
			return;
		}
		const idResponse = await contentApi.submitSourceData(sourceData);
		successStore.set('Šaltinis pateiktas sėkmingai');
		goto(`/submit/edit-source/${idResponse.data.id}`);
	}
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Naujas šaltinis (užduočių rinkinys)</h1>

<div class="relative">
	<div class="flex justify-center">
		<div class="flex flex-col gap-4 w-full lg:w-1/2 my-4">
			<div class="w-full">
				<Label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Dalykas
				</Label>
				<select
					id="subject"
					bind:value={subject}
					class="mt-1 block px-4 py-2 text-lg border-black dark:border-white border-2 w-full"
				>
					<option value="Matematika">Matematika</option>
					<option value="Fizika">Fizika</option>
					<option value="Chemija">Chemija</option>
					<option value="Biologija">Biologija</option>
					<option value="Lietuvių kalba ir literatūra">Lietuvių kalba ir literatūra</option>
					<option value="Anglų kalba">Anglų kalba</option>
					<option value="Istorija">Istorija</option>
					<option value="Informatika">Informatika</option>
					<option value="Informatika">Geografija</option>
					<option value="...Kita...">Kita</option>
				</select>
			</div>
			<div class="w-full">
				<Label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Šaltinio pavadinimas
				</Label>
				<Input
					id="name"
					type="text"
					bind:value={name}
					placeholder="Šaltinio pavadinimas"
					class="mt-1 block  px-4 py-2 text-lg border-black dark:border-white border-2"
				/>
			</div>
		</div>
	</div>
	<div>
		<Input disabled value={`🔒 ${sourceData.name}`} class="mt-1 block px-4 py-2 text-lg" />
		<Helper class="text-center"
			>Šaltinio dalyką, pavadinimą, matomumą bei aprašymą galėsite redaguoti vėliau...</Helper
		>
	</div>
	<div class="flex justify-center mt-4">
		<Button color="purple" on:click={submitSource} class="w-fit">Pridėti užduočių sąrašą</Button>
	</div>
</div>
