<script lang="ts">
	import { Button, Fileupload, Helper } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import MarkdownInput from './MarkdownInput.svelte';

	export let value: string | undefined;
	export let imageFile: File | null | undefined;
	export let label: string;

	let uploadedImage: string | undefined;

	$: {
		if (!imageFile) {
			uploadedImage = undefined;
		}
	}

	let isDragOver: boolean = false;

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

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
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
</script>

<div class="my-2">
	<p class="block text-sm font-medium text-gray-700 dark:text-gray-300">
		{label}
	</p>
	<div class="relative">
		<MarkdownInput bind:value />
		<div
			class={`flex flex-row gap-4 mt-1 px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${isDragOver ? 'bg-blue-200' : ''} }`}
		>
			<textarea
				class="w-10/12"
				placeholder="Tempkite arba įklijuokite paveikslėlį čia"
				on:dragover={handleDragOver}
				on:dragleave={handleDragLeave}
				on:drop={handleDrop}
				on:paste={handlePaste}
				value="Tempkite arba įklijuokite paveikslėlį čia"
				readonly
			></textarea>
			<div>
				<Fileupload
					id="with_helper"
					class="mb-2"
					size="sm"
					accept="image/*"
					file={imageFile}
					bind:value={uploadedImage}
					on:change={handleFileUpload}
				/>
				<Helper>SVG, PNG, JPG, GIF, ... (MAX. 1MB).</Helper>
			</div>
		</div>
	</div>

	{#if uploadedImage}
		<div class="my-6 relative w-fit border-black border-2">
			<Button
				color="red"
				on:click={() => {
					uploadedImage = undefined;
					imageFile = null;
				}}
				class="absolute top-[-15px] right-[-12px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 p-0"
				><CloseOutline class="w-full h-full p-0 m-0" /></Button
			>
			<img src={uploadedImage} alt="Uploaded" class="max-w-full h-auto" loading="lazy" />
		</div>
	{/if}
</div>
