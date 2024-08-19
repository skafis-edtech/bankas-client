<script lang="ts">
	import { ExpandOutline } from 'flowbite-svelte-icons';

	export let styleClasses = '';

	let offsetX: number;
	let offsetY: number;
	let isDragging: boolean = false;

	function handleMouseDown(e: MouseEvent): void {
		const target = document.getElementById('draggableDiv') as HTMLElement;
		offsetX = e.clientX - target.offsetLeft;
		offsetY = e.clientY - target.offsetTop;
		isDragging = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent): void {
		if (isDragging) {
			const draggableDiv = document.getElementById('draggableDiv') as HTMLElement;
			draggableDiv.style.top = `${e.clientY - offsetY}px`;
			draggableDiv.style.left = `${e.clientX - offsetX}px`;
		}
	}

	function handleMouseUp(): void {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}
</script>

<div
	id="draggableDiv"
	class={`resizable md:absolute flex flex-col fixed md:top-16 md:bottom-auto bottom-0 top-auto left-1 md:w-[18%] w-screen z-10 gap-4 bg-black p-4 rounded-md overflow-scroll md:h-[calc(100%-8rem)] h-1/3 ${styleClasses}`}
	role="dialog"
>
	<button
		class="absolute top-0 left-0 w-6 h-6 placeDrag bg-blue-500 p-1"
		on:mousedown={handleMouseDown}
		><ExpandOutline style="transform: rotate(45deg);" class="p-0 m-0 w-full h-full" /></button
	>
	<slot />
</div>

<style>
	.resizable {
		resize: both;
		overflow: auto;
	}
	button:focus {
		outline: none;
	}
	.placeDrag {
		cursor: move;
	}
</style>
