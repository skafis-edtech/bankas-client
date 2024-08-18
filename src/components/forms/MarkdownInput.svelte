<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';
	import { tikz } from '@cartamd/plugin-tikz';
	import MathLiveEditor from './MathLiveEditor.svelte';
	import { Button } from 'flowbite-svelte';

	export let value = '';
	let mdEditor: HTMLElement | null = null;
	let mathPopoverOpen = false;
	let mathfieldContainer: HTMLElement | null;

	onMount(() => {
		if (!mdEditor) {
			console.error('mdEditor is not found');
			return;
		}

		// Localize button text
		const writeTabs = mdEditor.querySelectorAll('button[tabindex="0"]');
		const previewTabs = mdEditor.querySelectorAll('button[tabindex="-1"]');

		writeTabs.forEach((writeTab) => {
			if (writeTab.textContent === 'Write') writeTab.textContent = 'Rašymas';
		});

		previewTabs.forEach((previewTab) => {
			if (previewTab.textContent === 'Preview') previewTab.textContent = 'Peržiūra';
		});

		// Attach event listeners to all textareas within the editor
		const textareas = mdEditor.querySelectorAll('textarea');
		if (textareas.length === 0) {
			console.log('No textareas found');
			return;
		}

		textareas.forEach((textarea) => {
			textarea.addEventListener('input', () => checkCursorPosition(textarea));
			textarea.addEventListener('click', () => checkCursorPosition(textarea));
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

	function checkCursorPosition(textarea: HTMLTextAreaElement) {
		const cursorPosition = textarea.selectionStart;

		// Check if the cursor is between $ signs
		const beforeCursor = textarea.value.slice(0, cursorPosition);
		const afterCursor = textarea.value.slice(cursorPosition);

		const beforeLastDollar = beforeCursor.lastIndexOf('$');
		const afterFirstDollar = afterCursor.indexOf('$');

		if (beforeLastDollar !== -1 && afterFirstDollar !== -1) {
			// Cursor is between $ signs
			mathPopoverOpen = true;
		} else {
			mathPopoverOpen = false;
		}
	}

	function printFormula(event: Event) {
		event.preventDefault();
		const textarea = mdEditor?.querySelector('textarea');
		if (!textarea) {
			console.error('Textarea not found');
			return;
		}

		const cursorPosition = textarea.selectionStart;
		const beforeCursor = textarea.value.slice(0, cursorPosition);
		const afterCursor = textarea.value.slice(cursorPosition);

		const beforeLastDollar = beforeCursor.lastIndexOf('$');
		const afterFirstDollar = afterCursor.indexOf('$');

		if (beforeLastDollar === -1 || afterFirstDollar === -1) {
			console.error('Cursor is not between $ signs');
			return;
		}

		const formula = textarea.value.slice(beforeLastDollar + 1, cursorPosition + afterFirstDollar);
		console.log('Formula:', formula);
		mathfieldContainer?.firstElementChild &&
			(mathfieldContainer.firstElementChild as any).setValue(formula);

		// Select the formula in the textarea
		textarea.setSelectionRange(beforeLastDollar, cursorPosition + afterFirstDollar + 1);
	}

	function insertTextAtCursor() {
		let text = '';
		if (mathfieldContainer?.firstElementChild) {
			const mathfield = mathfieldContainer.firstElementChild as any;
			const latex = mathfield.getValue();
			text = '$' + latex + '$ ';
		} else {
			alert('Mathfield container not found');
		}
		const textarea = document.querySelector('textarea');

		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = value.slice(0, start);
		const after = value.slice(end);

		value = before + text + after;

		// Set the cursor position after the inserted text
		textarea.selectionStart = textarea.selectionEnd = start + text.length;

		// Manually trigger an input event to update the editor's value
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
	}
</script>

<div class="text-black bg-white" bind:this={mdEditor}>
	<MarkdownEditor
		mode="tabs"
		placeholder="Čia galite rašyti Markdown, LaTex ir Tikz sintakse!"
		{carta}
		bind:value
	/>
	{#if mathPopoverOpen}
		<!-- Replace the button with a non-focusable div -->
		<button
			style="cursor: pointer; padding: 10px; background-color: lightgray; display: inline-block;"
			on:click={printFormula}
			type="button"
		>
			Modify formula
		</button>
	{/if}
</div>

<MathLiveEditor bind:mathfieldContainer />
<Button on:click={insertTextAtCursor}>Insert formula</Button>
