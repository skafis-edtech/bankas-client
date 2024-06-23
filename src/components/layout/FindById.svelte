<script lang="ts">
	import ProblemComponent from '$components/ui/ProblemComponent.svelte';
	import { Button, Input } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	let skfCode = writable('SKF-');

	// let problemAllData: ProblemWithMeta | null = null;

	const fetchStuff = async () => {
		console.log('fetching');
		// problemAllData = await fetchByIdAllData($skfCode);
	};
</script>

<div class="flex flex-col my-8 container mx-auto">
	<h1 class="text-2xl font-semibold text-center">Unikalus kodas</h1>
	<p class="text-center">Įveskite unikalų užduoties SKF kodą (skaičius)</p>
	<form on:submit|preventDefault={() => fetchStuff()} class="flex flex-col mb-8">
		<Input
			type="text"
			id="skf-code"
			bind:value={$skfCode}
			on:input={() => {
				if ($skfCode.slice(0, 4) !== 'SKF-') {
					skfCode.set('SKF-');
				}
				const numericPart = $skfCode.slice(4).replace(/\D/g, '');
				skfCode.set('SKF-' + numericPart);
			}}
			required
			placeholder="SKF-"
			class="block px-4 py-2 text-lg w-80 m-auto my-4"
		/>
		<Button class="m-auto text-center" type="submit">Rodyti</Button>
		<!-- </form>
	{#if problemAllData}
		<ProblemComponent {problemAllData} />
	{/if} -->
	</form>
</div>
