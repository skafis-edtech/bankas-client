<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Dropzone, Modal } from 'flowbite-svelte';

	export let open = true;
	export let groupedUpload: { listNr: number; file: File | null; display: string }[] = [];
	export let onSubmit: () => void;

	const isImage = (file: File): boolean => {
		return file.type.startsWith('image/');
	};

	const dropHandle = async (event: DragEvent): Promise<void> => {
		event.preventDefault();
		const newGroupedUpload: { listNr: number; file: File | null; display: string }[] = [];
		if (event.dataTransfer?.items) {
			for (const item of event.dataTransfer.items) {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file && isImage(file)) {
						const src = await readFileAsDataURL(file);
						const listNr = parseInt(file.name);
						newGroupedUpload.push({ listNr, file, display: src });
					} else {
						console.log('Not a file or not an image');
					}
				}
			}
		} else if (event.dataTransfer?.files) {
			for (const file of event.dataTransfer.files) {
				if (isImage(file)) {
					const src = await readFileAsDataURL(file);
					const listNr = parseInt(file.name);
					newGroupedUpload.push({ listNr, file, display: src });
				} else {
					console.log('Not an image');
				}
			}
		}
		groupedUpload = newGroupedUpload;
	};

	const handleChange = async (event: Event): Promise<void> => {
		const input = event.target as HTMLInputElement;
		const fileList = input.files;
		if (fileList) {
			const newGroupedUpload: { listNr: number; file: File | null; display: string }[] = [];
			for (const file of fileList) {
				if (isImage(file)) {
					const src = await readFileAsDataURL(file);
					const listNr = parseInt(file.name);
					newGroupedUpload.push({ listNr, file, display: src });
				} else {
					console.log('Not an image');
				}
			}
			groupedUpload = newGroupedUpload;
		}
	};

	const readFileAsDataURL = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				resolve(event.target?.result as string);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};
</script>

<Modal bind:open>
	<h2 class="mb-4 text-lg font-semibold">
		Įkelkite paveikslėlius, užvardintus pradžioje numeriu, pvz. "1-failas.png", "2kitasfailas.jpg",
		"3.png"
	</h2>
	<h3>
		Uždavinių failų karpymą ir vardinimą galite palengvinti naudodamiesi tinklapio <Button
			on:click={() => goto('/snipping-tool')}>KARPYMO ĮRANKIU</Button
		>
	</h3>
	<Dropzone
		id="dropzone"
		multiple
		on:drop={dropHandle}
		on:dragover={(event) => {
			event.preventDefault();
		}}
		on:change={handleChange}
	>
		{#if groupedUpload.length === 0}
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
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				SVG, PNG, JPG, GIF, ... (each MAX 1 MB)
			</p>
		{:else}
			<div class="flex flex-wrap">
				{#each groupedUpload as upload}
					<img src={upload.display} alt="Uploaded" class="w-40 h-auto mt-2" />
				{/each}
			</div>
		{/if}
	</Dropzone>

	<Button color="green" on:click={onSubmit}>Sukelti užduotis</Button>
</Modal>
