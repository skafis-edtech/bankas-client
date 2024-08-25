<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';
	import { tikz } from '@cartamd/plugin-tikz';
	import MathLiveEditor from './MathLiveEditor.svelte';
	import { Button } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { getEventListeners } from 'events';

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
		customizeHeader();
		customizeTextarea();

		// Listen for clicks on the "Write" tab to reapply customizations
		const writeTab = mdEditor.querySelector('button[tabindex="0"]');
		if (writeTab) {
			writeTab.addEventListener('click', () => {
				// Reapply customizations when the "Write" tab is clicked
				const newTextarea = mdEditor?.querySelector('textarea');
				if (newTextarea && !textareaElement) {
					textareaElement = newTextarea;
					customizeTextarea(); // Reapply event listeners and other customizations
					console.log('Reapplied customizations');
				} else {
					console.log("It's ok, no need to reapply");
				}
			});
		}
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

	function customizeHeader() {
		if (!mdEditor) {
			console.error('mdEditor is not found');
			return;
		}

		// Trnaslate the tabs to LT
		const writeTab = mdEditor.querySelector('button[tabindex="0"]') as HTMLButtonElement;
		const previewTab = mdEditor.querySelector('button[tabindex="-1"]') as HTMLButtonElement;

		if (!writeTab || !previewTab) {
			console.error('Tabs not found');
		} else {
			if (writeTab.textContent === 'Write') writeTab.textContent = 'Rašymas';
			if (previewTab.textContent === 'Preview') previewTab.textContent = 'Peržiūra';
			previewTab.setAttribute(
				'style',
				'background-color: #4338ca; color: white; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 0.375rem; margin-left: 0.5rem; margin-right: 0.5rem; width: fit-content; transition: background-color 0.2s ease-in-out;'
			);
			previewTab.addEventListener('mouseover', function () {
				previewTab.style.backgroundColor = '#3730a3'; // Darker green for hover
			});

			previewTab.addEventListener('mouseout', function () {
				previewTab.style.backgroundColor = '#4338ca'; // Original green
			});

			writeTab.setAttribute(
				'style',
				'background-color: #f97316; color: white; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 0.375rem; margin-left: 0.5rem; margin-right: 0.5rem; width: fit-content; transition: background-color 0.2s ease-in-out;'
			);
			writeTab.addEventListener('mouseover', function () {
				writeTab.style.backgroundColor = '#ea580c'; // Darker green for hover
			});

			writeTab.addEventListener('mouseout', function () {
				writeTab.style.backgroundColor = '#f97316'; // Original green
			});
		}

		// Add a button to insert math formulas
		const formulaButton = document.createElement('button');
		formulaButton.textContent = 'Įterpti formulę';
		formulaButton.addEventListener('click', openMathEditorForCreating);
		formulaButton.classList.add(
			'bg-green-500',
			'text-white',
			'px-2',
			'rounded-md',
			'hover:bg-green-600',
			'mx-2',
			'w-fit',
			'text-sm',
			'p-0'
		);
		formulaButton.id = 'formula-tool-btn';
		mdEditor.querySelector('.carta-toolbar-right')?.children[0]?.before(formulaButton);

		// Add a help button
		const helpButton = document.createElement('button');
		helpButton.textContent = 'Pagalba';
		helpButton.addEventListener('click', () => {
			window.open('/about#editor-guide', '_blank');
		});
		helpButton.classList.add(
			'bg-blue-500',
			'text-white',
			'px-2',
			'rounded-md',
			'hover:bg-blue-600',
			'mx-2',
			'W-fit'
		);
		mdEditor.querySelector('.carta-toolbar')?.children[3]?.after(helpButton);
	}

	function customizeTextarea() {
		textareaElement.removeEventListener('keydown', replaceKeys);
		textareaElement.addEventListener('keydown', replaceKeys);

		// Add input listener to check the cursor position - for formula insertion
		textareaElement.addEventListener('input', () => checkCursorPosition(textareaElement));
		textareaElement.addEventListener('click', () => checkCursorPosition(textareaElement));
	}

	function replaceKeys(event: KeyboardEvent) {
		if (value.includes('```') || value.match(/.[^ ]- ./)) return;
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent default newline action

			const cursorPosition = textareaElement.selectionStart;
			const beforeCursor = textareaElement.value.slice(0, cursorPosition);
			const afterCursor = textareaElement.value.slice(cursorPosition);

			// Insert the backslash and newline character
			textareaElement.value = `${beforeCursor}\\\n${afterCursor}`;

			// Move the cursor to the correct position after inserting
			textareaElement.setSelectionRange(cursorPosition + 2, cursorPosition + 2);

			// Manually trigger an input event to update the editor's value
			textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
		}
		if (event.key === 'Tab') {
			event.preventDefault(); // Prevent default tab action

			const cursorPosition = textareaElement.selectionStart;
			const beforeCursor = textareaElement.value.slice(0, cursorPosition - 1);
			const afterCursor = textareaElement.value.slice(cursorPosition);

			// Insert the tab character
			textareaElement.value = `${beforeCursor}&emsp;${afterCursor}`;

			// Move the cursor to the correct position after inserting
			textareaElement.setSelectionRange(cursorPosition + 6, cursorPosition + 6);

			// Manually trigger an input event to update the editor's value
			textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
		}
		if (event.key === ' ') {
			event.preventDefault(); // Prevent default tab action

			const cursorPosition = textareaElement.selectionStart;
			const prevText = textareaElement.value.slice(cursorPosition - 6, cursorPosition); // Adjust slice length to match the longest string you're checking
			if (
				prevText.endsWith(' ') || // Regular space
				prevText.endsWith('&nbsp;') || // Check if it ends with &nbsp;
				prevText.endsWith('&emsp;') // Check if it ends with &emsp;
			) {
				const beforeCursor = textareaElement.value.slice(0, cursorPosition);
				const afterCursor = textareaElement.value.slice(cursorPosition);

				// Insert the tab character
				textareaElement.value = `${beforeCursor}&nbsp;${afterCursor}`;

				// Move the cursor to the correct position after inserting
				textareaElement.setSelectionRange(cursorPosition + 6, cursorPosition + 6);

				// Manually trigger an input event to update the editor's value
				textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
			} else {
				const beforeCursor = textareaElement.value.slice(0, cursorPosition);
				const afterCursor = textareaElement.value.slice(cursorPosition);

				// Insert the tab character
				textareaElement.value = `${beforeCursor} ${afterCursor}`;

				// Move the cursor to the correct position after inserting
				textareaElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
				textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
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
		btn.classList.remove('bg-green-500', 'hover:bg-green-600');
		btn.classList.add('bg-orange-500', 'hover:bg-orange-600');
		btn.textContent = 'Redaguoti formulę';
		btn.removeEventListener('click', openMathEditorForCreating);
		btn.addEventListener('click', openMathEditorForEditing);
	}

	function setMathCreateState(btn: Element) {
		mathEditorState = 'create';
		btn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
		btn.classList.add('bg-green-500', 'hover:bg-green-600');
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

<div bind:this={mdEditor} class="w-full">
	<div class="text-black bg-white relative w-full">
		<MarkdownEditor
			mode="tabs"
			placeholder="Čia galite rašyti tekstą, formules ir kita..."
			{carta}
			bind:value
		/>
	</div>
	<div id="math-editor" class="hidden md:w-1/2 p-4 m-2 bg-blue-100 rounded-md relative bg-">
		<p>Formulės kūrimas/redagavimas</p>
		<MathLiveEditor bind:mathfieldContainer onChange={insertTextAtCursor} />
		<Button
			color="red"
			on:click={closeMathEditor}
			class="w-5 h-5 absolute right-[-5px] top-[-5px] bg-red-600 rounded-full flex items-center hover:bg-red-800 p-0 m-0"
			><CloseOutline class="w-full h-full p-0 m-0" /></Button
		>
	</div>
</div>
