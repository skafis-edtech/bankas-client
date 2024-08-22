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
	let mathfieldContainer: HTMLElement | null;
	let textareaElement: HTMLTextAreaElement;
	let mathEditorState: 'create' | 'edit' = 'create';

	onMount(() => {
		if (!mdEditor) {
			console.error('Md editor not found');
			return;
		}
		const textarea = mdEditor?.querySelector('textarea');
		if (!textarea) {
			console.error('Textarea not found');
			return;
		}
		textareaElement = textarea;
		makeLtAndAddMathButton();
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

	function makeLtAndAddMathButton() {
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

		const formulaButton = document.createElement('button');
		formulaButton.textContent = 'Įterpti formulę';
		formulaButton.addEventListener('click', openMathEditorForCreating);
		formulaButton.classList.add(
			'bg-blue-500',
			'text-white',
			'px-2',
			'rounded-md',
			'hover:bg-blue-600',
			'mx-2',
			'W-fit'
		);
		formulaButton.id = 'formula-tool-btn';
		mdEditor.querySelector('.carta-toolbar')?.children[1]?.before(formulaButton);

		textareaElement.addEventListener('input', () => checkCursorPosition(textareaElement));
		textareaElement.addEventListener('click', () => checkCursorPosition(textareaElement));
	}

	function checkCursorPosition(textarea: HTMLTextAreaElement) {
		const cursorPosition = textarea.selectionStart;

		// Check if the cursor is between $ signs
		const beforeCursor = textarea.value.slice(0, cursorPosition);
		const afterCursor = textarea.value.slice(cursorPosition);

		// Count the number of $ signs before and after the cursor
		const beforeDollarCount = (beforeCursor.match(/\$/g) || []).length;
		const afterDollarCount = (afterCursor.match(/\$/g) || []).length;

		const formulaBtn = mdEditor?.querySelector('#formula-tool-btn');
		if (!formulaBtn) {
			console.error('Formula button not found');
			return;
		}

		// Check if the cursor is within an even number of $ signs on both sides
		if (beforeDollarCount % 2 === 1) {
			// Cursor is genuinely between a pair of $ signs
			setMathEditingState(formulaBtn);
		} else {
			// Cursor is not between valid $ pairs
			setMathCreateState(formulaBtn);
			closeMathEditor(); // Close the math editor if the cursor is out of dollar sign boundaries
		}
	}

	function setMathEditingState(btn: Element) {
		mathEditorState = 'edit';
		btn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
		btn.classList.add('bg-orange-500', 'hover:bg-orange-600');
		btn.textContent = 'Redaguoti formulę';
		btn.removeEventListener('click', openMathEditorForCreating);
		btn.addEventListener('click', openMathEditorForEditing);
	}

	function setMathCreateState(btn: Element) {
		mathEditorState = 'create';
		btn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
		btn.classList.add('bg-blue-500', 'hover:bg-blue-600');
		btn.textContent = 'Įterpti formulę';
		btn.removeEventListener('click', openMathEditorForEditing);
		btn.addEventListener('click', openMathEditorForCreating);
	}

	function openMathEditor() {
		if (mdEditor) {
			const mathDiv = mdEditor.querySelector('#math-editor');
			if (mathDiv) {
				mathDiv.classList.remove('hidden');
			} else {
				console.error('No math div found');
			}
		} else {
			console.error('Md editor not found');
		}
	}

	function closeMathEditor() {
		if (mdEditor) {
			const mathDiv = mdEditor.querySelector('#math-editor');
			if (mathDiv) {
				mathDiv.classList.add('hidden');
			} else {
				console.error('No math div found');
			}
		} else {
			console.error('Md editor not found');
		}
	}

	function setMathEditorValue(value: string) {
		if (mathfieldContainer?.firstElementChild) {
			const mathfield = mathfieldContainer?.firstElementChild as any;
			mathfield.setValue(value);
		} else {
			console.error('MathLive editor is not initialized properly.');
		}
	}

	function getMathEditorValue() {
		if (mathfieldContainer?.firstElementChild) {
			const mathfield = mathfieldContainer?.firstElementChild as any;
			return mathfield.value;
		} else {
			console.error('MathLive editor is not initialized properly.');
		}
	}

	function getCursorBetweenDollarIndexes(textarea: HTMLTextAreaElement): {
		start: number;
		end: number;
	} {
		const cursorPosition = textarea.selectionStart;
		const beforeCursor = textarea.value.slice(0, cursorPosition);
		const afterCursor = textarea.value.slice(cursorPosition);

		const beforeLastDollar = beforeCursor.lastIndexOf('$');
		const afterFirstDollar = afterCursor.indexOf('$');

		if (beforeLastDollar === -1 || afterFirstDollar === -1) {
			console.error('Cursor is not between $ signs');
		}
		return { start: beforeLastDollar, end: cursorPosition + afterFirstDollar + 1 };
	}

	function openMathEditorForCreating(event: Event) {
		event.preventDefault();
		openMathEditor();
		setMathEditorValue('');
	}

	function openMathEditorForEditing(event: Event) {
		event.preventDefault();
		const { start, end } = getCursorBetweenDollarIndexes(textareaElement);
		const formula = textareaElement.value.slice(start + 1, end - 1);
		setMathEditorValue(formula);
		openMathEditor();
	}

	function insertTextAtCursor() {
		const latex = getMathEditorValue();
		const text = '$' + latex + '$';

		let start;
		let end;

		if (mathEditorState === 'create') {
			start = textareaElement.selectionStart;
			end = textareaElement.selectionEnd;
		} else {
			({ start, end } = getCursorBetweenDollarIndexes(textareaElement));
		}

		// Determine if a space is needed before or after the insertion
		const beforeCursor = value[start - 1];
		const afterCursor = value[end];

		let insertText = text;

		if (beforeCursor === '$') {
			insertText = ' ' + insertText;
		}
		if (afterCursor === '$') {
			insertText = insertText + ' ';
		}

		// Insert the text
		value = value.slice(0, start) + insertText + value.slice(end);

		// Update the textarea value
		textareaElement.value = value;

		// Calculate the position just after the first dollar sign of the inserted text
		const cursorPosition = start + (beforeCursor === '$' ? 2 : 1);

		// Set the cursor position
		textareaElement.setSelectionRange(cursorPosition, cursorPosition);

		// Manually trigger an input event to update the editor's value
		textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
	}
</script>

<div bind:this={mdEditor}>
	<div class="text-black bg-white">
		<MarkdownEditor
			mode="tabs"
			placeholder="Čia galite rašyti Markdown, LaTex ir Tikz sintakse!"
			{carta}
			bind:value
		/>
	</div>
	<div id="math-editor" class="hidden md:w-1/2 p-4 m-2 bg-blue-100 rounded-md relative">
		<p>Formulės kūrimas/redagavimas</p>
		<MathLiveEditor bind:mathfieldContainer onChange={insertTextAtCursor} />
		<Button on:click={closeMathEditor} class="absolute top-0 right-0 w-fit h-fit">x</Button>
	</div>
</div>
