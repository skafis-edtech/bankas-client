<script lang="ts">
	import { Fileupload, Helper } from 'flowbite-svelte';
	export let tempImageDisplay: string | undefined;
	export let imageFile: File | null | undefined;

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
					tempImageDisplay = e.target?.result as string;
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
						tempImageDisplay = e.target?.result as string;
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
					tempImageDisplay = e.target?.result as string;
				};
				reader.readAsDataURL(file);

				imageFile = file;
			}
		}
	}
</script>

<div
	class={`flex flex-row gap-4 mt-1 px-4 py-2 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${isDragOver ? 'bg-blue-200' : ''} }`}
>
	<div class="relative">
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
		<!-- {#if isDragOver}
			<div class="absolute top-0 left-0 w-full h-full bg-blue-400"></div>
		{/if} -->
	</div>

	<div>
		<Fileupload
			id="with_helper"
			class="mb-2"
			size="sm"
			accept="image/*"
			file={imageFile}
			bind:value={tempImageDisplay}
			on:change={handleFileUpload}
		/>
		<Helper>SVG, PNG, JPG, GIF, ... (MAX. 1MB).</Helper>
	</div>
</div>
