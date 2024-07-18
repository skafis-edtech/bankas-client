<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte';
	import { CloseOutline, TrashBinOutline, XSolid } from 'flowbite-svelte-icons';
	import MarkdownInput from './MarkdownInput.svelte';

	export let value: string | undefined;
	export let imageFile: File | null | undefined;
	export let label: string;
	export let id: string;
	export let textareaClass: string = '';

	let uploadedImage: string | undefined;

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
	<p class="block text-sm font-medium text-gray-700 dark:text-gray-300">
		{label}
	</p>
	<div class="relative">
		<MarkdownInput bind:value />
		<textarea
			placeholder="Įveskite tekstą ir/arba nutempkite arba įklijuokite paveikslėlį..."
			class={`mt-1 block px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${isDragOver ? 'bg-blue-200' : ''} ${textareaClass}`}
			on:input={handleInput}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
			on:paste={handlePaste}
		></textarea>
	</div>

	{#if uploadedImage}
		<div class="my-6 relative w-fit border-black border-2">
			<Button
				color="red"
				on:click={() => (uploadedImage = undefined)}
				class="absolute top-[-15px] right-[-12px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 p-0"
				><CloseOutline class="w-full h-full p-0 m-0" /></Button
			>
			<img src={uploadedImage} alt="Uploaded" class="max-w-full h-auto" loading="lazy" />
		</div>
	{/if}
</div>
