<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';

	export let value = '';

	onMount(() => {
		const writeTab = document.querySelector('button[tabindex="0"]');
		const previewTab = document.querySelector('button[tabindex="-1"]');

		if (writeTab && previewTab) {
			writeTab.textContent = 'Rašymas';
			previewTab.textContent = 'Peržiūra';
		}
	});

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		shikiOptions: {
			langs: ['javascript', 'typescript', 'html', 'css', 'svelte'],
			themes: ['nord']
		},
		extensions: [math()]
	});
</script>

<div class="text-black">
	<MarkdownEditor
		mode="tabs"
		placeholder="Čia galite rašyti ir markdown bei LaTex sintakse!"
		{carta}
		bind:value
	/>
</div>
