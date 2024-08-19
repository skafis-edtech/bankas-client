<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import { math } from '@cartamd/plugin-math';
	import { onMount } from 'svelte';
	import { tikz } from '@cartamd/plugin-tikz';
	import MathLiveEditor from './MathLiveEditor.svelte';
	import { Alert, Button } from 'flowbite-svelte';

	export let value = '';
	let mdEditor: HTMLElement | null = null;
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

		const formulaButton = document.createElement('button');
		formulaButton.textContent = 'Įterpti formulę';
		formulaButton.addEventListener('click', () => {
			const mathDiv = mdEditor?.querySelector('#math-editor');
			mathDiv?.classList.remove('hidden');
		});
		formulaButton.classList.add(
			'bg-blue-500',
			'text-white',
			'px-2',
			'rounded-md',
			'hover:bg-blue-600',
			'mx-2'
		);
		formulaButton.id = 'formula-tool-btn';
		mdEditor.querySelector('.carta-toolbar')?.children[1]?.before(formulaButton);

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
			const formulaBtn = mdEditor?.querySelector('#formula-tool-btn');
			if (!formulaBtn) {
				console.error('Formula button not found');
				return;
			}

			formulaBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
			formulaBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
			formulaBtn.textContent = 'Redaguoti formulę';
			formulaBtn.removeEventListener('click', () => {
				openMathEditor();
				setMathEditorValue('');
			});
			formulaBtn.addEventListener('click', (event) => editFormula(event));
		} else {
			const formulaBtn = mdEditor?.querySelector('#formula-tool-btn');
			if (!formulaBtn) {
				console.error('Formula button not found');
				return;
			}
			formulaBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
			formulaBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
			if (formulaBtn.textContent === 'Redaguoti formulę') {
				const mathDiv = mdEditor?.querySelector('#math-editor');
				mathDiv?.classList.add('hidden');
			}
			formulaBtn.textContent = 'Įterpti formulę';
			formulaBtn.removeEventListener('click', (event) => editFormula(event));
			formulaBtn.addEventListener('click', () => {
				openMathEditor();
				setMathEditorValue('');
			});
		}
	}

	function selectBetweenDollars() {
		if (!mdEditor) {
			console.error('Md editor not found');
			return;
		}
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
		textarea.setSelectionRange(beforeLastDollar, cursorPosition + afterFirstDollar + 1);

		return textarea.value.slice(beforeLastDollar + 1, cursorPosition + afterFirstDollar);
	}

	async function editFormula(event: Event) {
		event.preventDefault();

		const formula = selectBetweenDollars() as string;
		console.log('Formula:', formula);

		setMathEditorValue(formula);

		openMathEditor();
	}

	function insertTextAtCursor() {
		let text = '';
		if (mathfieldContainer?.firstElementChild) {
			const mathfield = mathfieldContainer.firstElementChild as any;
			const latex = mathfield.getValue();
			text = '$' + latex + '$';
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
	<div id="math-editor" class="hidden w-1/2 p-4 m-2 bg-blue-100 rounded-md">
		<p>Formulės kūrimas/redagavimas</p>
		<MathLiveEditor bind:mathfieldContainer onChange={insertTextAtCursor} />
		<Button on:click={insertTextAtCursor}>Įterpti</Button>
		<Button on:click={closeMathEditor}>Uždaryti</Button>
	</div>
</div>
