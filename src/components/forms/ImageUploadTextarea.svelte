<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import MarkdownInput from './MarkdownInput.svelte';
	import SmallFileUpload from './SmallFileUpload.svelte';

	export let value: string | undefined;
	export let imageFile: File | null | undefined;
	export let label: string;

	export let tempImageDisplay: string | undefined;

	$: {
		if (!imageFile) {
			tempImageDisplay = undefined;
		}
	}
</script>

<div class="my-2">
	<p class="block text-sm font-medium text-gray-700 dark:text-gray-300">
		{label}
	</p>
	{#if !imageFile}
		<div class="relative">
			<MarkdownInput bind:value />
			{#if !imageFile}
				<SmallFileUpload bind:imageFile bind:tempImageDisplay />
			{/if}
		</div>
	{:else}
		<details>
			<summary>Regaduoti tekstą</summary>
			<div class="relative">
				<MarkdownInput bind:value />
				{#if !imageFile}
					<SmallFileUpload bind:imageFile bind:tempImageDisplay />
				{/if}
			</div>
		</details>
	{/if}

	{#if tempImageDisplay}
		<div class="my-6 relative w-fit border-black border-2">
			<Button
				color="red"
				on:click={() => {
					tempImageDisplay = undefined;
					imageFile = null;
				}}
				class="absolute top-[-15px] right-[-12px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 p-0"
				><CloseOutline class="w-full h-full p-0 m-0" /></Button
			>
			<img src={tempImageDisplay} alt="Uploaded" class="max-w-full h-auto" loading="lazy" />
		</div>
	{/if}
</div>
