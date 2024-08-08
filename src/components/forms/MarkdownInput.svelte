<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';
	import { tikz } from '@cartamd/plugin-tikz';

	export let value = '';

	onMount(() => {
		const writeTabs = document.querySelectorAll('button[tabindex="0"]');
		const previewTabs = document.querySelectorAll('button[tabindex="-1"]');

		writeTabs.forEach((writeTab) => {
			if (writeTab.textContent === 'Write') writeTab.textContent = 'Rašymas';
		});

		previewTabs.forEach((previewTab) => {
			if (previewTab.textContent === 'Preview') previewTab.textContent = 'Peržiūra';
		});
	});

	const carta = new Carta({
		sanitizer: (dirty) => {
			const clean = DOMPurify.sanitize(dirty);
			const div = document.createElement('div');
			div.innerHTML = clean;
			const tikzElements = div.querySelectorAll('div[type="text/tikz"]');
			tikzElements.forEach((element) => {
				element.innerHTML = '';
			});
			return div.innerHTML;
		},
		shikiOptions: {
			langs: ['javascript', 'typescript', 'html', 'css', 'svelte'],
			themes: ['nord']
		},
		extensions: [math(), tikz()]
	});
</script>

<div class="text-black">
	<MarkdownEditor
		mode="tabs"
		placeholder="Čia galite rašyti Markdown, LaTex ir Tikz sintakse!"
		{carta}
		bind:value
	/>
</div>
