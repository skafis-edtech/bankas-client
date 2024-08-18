<script lang="ts">
	import { onMount } from 'svelte';

	export let mathfieldContainer: HTMLElement | null = null;

	onMount(async () => {
		if (typeof window !== 'undefined' && mathfieldContainer) {
			// Load MathLive as a module
			const MathLive = await import('mathlive');

			// Load the CSS directly from a CDN
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/mathlive/dist/mathlive-static.css';
			document.head.appendChild(link);

			// Create the Mathfield element
			const mathfield = new MathLive.MathfieldElement({
				// Use index signature to avoid TypeScript errors
				...({
					virtualKeyboardMode: 'manual' // Assuming this is a valid option
				} as any)
			});

			// Apply some additional styles to the Mathfield
			mathfield.style.width = '100%';
			mathfield.style.height = 'fit-content';
			mathfield.style.padding = '10px';
			mathfield.style.border = '1px solid #ccc';
			mathfield.style.borderRadius = '4px';
			mathfield.style.fontSize = '24px';

			// Append the Mathfield to the container
			mathfieldContainer.appendChild(mathfield);
		}
	});
</script>

<!-- Container for the MathLive element -->
<div bind:this={mathfieldContainer}></div>
