<script lang="ts">
	import { Label } from 'flowbite-svelte';

	export let value: string | undefined;
	export let imageFile: File | null | undefined;

	let uploadedImage: string | undefined;

	export let label: string;
	export let id: string;
	export let textareaClass: string = '';

	let isDragOver: boolean = false;

	function handleInput(event: Event) {
		value = (event.target as HTMLTextAreaElement).value;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e: ProgressEvent<FileReader>) => {
					uploadedImage = e.target?.result as string;
				};
				reader.readAsDataURL(file);

				imageFile = file;
			}
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (items) {
			const item = items[0];
			if (item.type.startsWith('image/')) {
				const file = item.getAsFile();
				if (file) {
					const reader = new FileReader();
					reader.onload = (e: ProgressEvent<FileReader>) => {
						uploadedImage = e.target?.result as string;
					};
					reader.readAsDataURL(file);

					imageFile = file;
				}
			}
		}
	}
</script>

<div class="my-2">
	<Label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
		{label}
	</Label>
	<textarea
		{id}
		bind:value
		placeholder="Įveskite tekstą ir/arba nutempkite arba įklijuokite paveikslėlį..."
		class={`mt-1 block px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${isDragOver ? 'bg-blue-100' : ''} ${textareaClass}`}
		on:input={handleInput}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		on:paste={handlePaste}
	></textarea>
	{#if uploadedImage}
		<div class="mt-2">
			<img src={uploadedImage} alt="Uploaded" class="max-w-full h-auto rounded-lg border" />
		</div>
	{/if}
</div>

<style>
	.bg-blue-100 {
		background-color: #49bfff; /* light bluish color */
	}
</style>
