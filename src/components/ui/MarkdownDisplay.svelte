<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';
	import { tikz } from '@cartamd/plugin-tikz';

	export let value = '';
	let markdowndisplay: HTMLDivElement;

	onMount(() => {
		const writeTabs = markdowndisplay.querySelectorAll('button[tabindex="0"]');
		const previewTabs = markdowndisplay.querySelectorAll('button[tabindex="-1"]');

		writeTabs.forEach((writeTab) => {
			if (writeTab.textContent === 'Write') writeTab.textContent = 'Rašymas';
		});

		previewTabs.forEach((previewTab) => {
			if (previewTab.textContent === 'Preview') previewTab.textContent = 'Peržiūra';
		});

		const cartaeditors = markdowndisplay.querySelectorAll('.carta-editor');
		cartaeditors.forEach((cartaeditor) => {
			cartaeditor.classList.add('important-no-border');
		});
		const cartawrappers = markdowndisplay.querySelectorAll('.carta-wrapper');
		cartawrappers.forEach((cartawrapper) => {
			cartawrapper.classList.add('important-no-m-p');
		});
		const cartacontainer = markdowndisplay.querySelectorAll('.carta-renderer');
		cartacontainer.forEach((carta) => {
			carta.classList.add('important-no-m-p');
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

<div class="text-black scale-container" bind:this={markdowndisplay}>
	<MarkdownEditor
		mode="tabs"
		disableToolbar
		selectedTab="preview"
		placeholder="This shouldn't be displayed"
		{carta}
		{value}
	/>
</div>
