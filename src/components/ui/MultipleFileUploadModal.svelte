<script lang="ts">
	import { Dropzone, Modal } from 'flowbite-svelte';

	export let value: string[] = [];
	export let open = false;

	const dropHandle = (event: DragEvent): void => {
		value = [];
		event.preventDefault();
		if (event.dataTransfer?.items) {
			[...event.dataTransfer.items].forEach((item) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file) {
						value.push(file.name);
						value = value;
					}
				}
			});
		} else if (event.dataTransfer?.files) {
			[...event.dataTransfer.files].forEach((file) => {
				value.push(file.name);
				value = value;
			});
		}
	};

	const handleChange = (event: Event): void => {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			value.push(files[0].name);
			value = value;
		}
	};

	const showFiles = (files: string[]): string => {
		if (files.length === 1) return files[0];
		let concat = '';
		files.forEach((file) => {
			concat += file;
			concat += ', ';
		});

		if (concat.length > 40) concat = concat.slice(0, 40);
		concat += '...';
		return concat;
	};
</script>

<Modal bind:open>
	<h2 class="mb-4 text-lg font-semibold">
		Įkelkite paveikslėlius, užvardintus pradžioje numeriu, pvz. "1-failas.png", "2kitasfailas.jpg",
		"3.png"
	</h2>
	<Dropzone
		id="dropzone"
		on:drop={dropHandle}
		on:dragover={(event) => {
			event.preventDefault();
		}}
		on:change={handleChange}
	>
		<svg
			aria-hidden="true"
			class="mb-3 w-10 h-10 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
			/>
		</svg>
		{#if value.length === 0}
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				SVG, PNG, JPG, GIF, ... (each MAX 1 MB)
			</p>
		{:else}
			<p>{showFiles(value)}</p>
		{/if}
	</Dropzone>
</Modal>
