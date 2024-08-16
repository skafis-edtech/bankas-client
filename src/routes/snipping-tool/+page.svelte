<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	interface ImageData {
		name: string;
		src: string;
	}

	interface Rectangle {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	let files = writable<File[]>([]);
	let images = writable<ImageData[]>([]);
	let rectangles = writable<Rectangle[]>([]);
	let selecting = false;
	let startX = 0,
		startY = 0;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let imgLoaded = writable<boolean[]>([]);

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const selectedFiles = Array.from(target.files || []);
		files.set(selectedFiles);

		const fileReaders = selectedFiles.map((file) => {
			return new Promise<ImageData>((resolve) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					resolve({ name: file.name, src: e.target!.result as string });
				};
				reader.readAsDataURL(file);
			});
		});

		Promise.all(fileReaders).then((imagesData) => {
			images.set(imagesData);
			imgLoaded.set(new Array(imagesData.length).fill(false));
		});
	};

	const handleMouseDown = (event: MouseEvent) => {
		startX = event.offsetX;
		startY = event.offsetY;
		selecting = true;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!selecting) return;
		const mouseX = event.offsetX;
		const mouseY = event.offsetY;

		const width = mouseX - startX;
		const height = mouseY - startY;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawExistingRectangles();
		ctx.strokeStyle = 'red';
		ctx.strokeRect(startX, startY, width, height);
	};

	const handleMouseUp = (event: MouseEvent) => {
		if (!selecting) return;
		selecting = false;
		const mouseX = event.offsetX;
		const mouseY = event.offsetY;

		rectangles.update((rects) => [
			...rects,
			{
				x: Math.min(startX, mouseX),
				y: Math.min(startY, mouseY),
				width: Math.abs(mouseX - startX),
				height: Math.abs(mouseY - startY)
			}
		]);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawExistingRectangles();
	};

	const drawExistingRectangles = () => {
		$rectangles.forEach((rect) => {
			ctx.strokeStyle = 'red';
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		});
	};

	const downloadScreenshots = async () => {
		const imgElements = document.querySelectorAll('.image-container img');
		const snippets: string[] = [];

		for (const [index, rect] of $rectangles.entries()) {
			const img = imgElements[0] as HTMLImageElement; // Assuming only one image for simplicity
			const snippetCanvas = document.createElement('canvas');
			const snippetCtx = snippetCanvas.getContext('2d')!;
			snippetCanvas.width = rect.width;
			snippetCanvas.height = rect.height;
			snippetCtx.drawImage(
				img,
				rect.x,
				rect.y,
				rect.width,
				rect.height,
				0,
				0,
				rect.width,
				rect.height
			);

			const dataUrl = snippetCanvas.toDataURL('image/png');
			snippets.push(dataUrl);
		}

		for (const [index, snippet] of snippets.entries()) {
			const a = document.createElement('a');
			a.href = snippet;
			a.download = `${index + 1}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	};

	const onImageLoad = (index: number) => {
		imgLoaded.update((loaded) => {
			loaded[index] = true;
			return loaded;
		});
	};

	onMount(() => {
		canvas = document.getElementById('selectionCanvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = 10 * window.innerHeight;
	});

	const clearRectangles = () => {
		rectangles.set([]);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Karpymo įrankis</h1>
<h3 class="text-lg text-center">
	Įkelkite užduočių sąrašų paveiksliukus, iš eilės pažymėkite stačiakampiais, atsisiųskite
	sunumeruotus paveiksliukus, pateikite automatizavimui užduočių pateikimo puslapyje. Įrankis turi
	trūkumų.
</h3>

<div class="p-6">
	<input type="file" multiple accept="image/*" on:change={handleFileChange} class="mb-4" />
	<Button class="mt-4" on:click={downloadScreenshots}>Atsisiųsti iškirptas ekrano nuotraukas</Button
	>
	<Button class="mt-4 ml-4" on:click={clearRectangles}>Išvalyti stačiakampius</Button>

	<canvas
		id="selectionCanvas"
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		class="absolute top-80 left-0 z-10"
	></canvas>
	<div class="absolute top-80 left-0 image-container">
		{#each $images as image, index (image.name)}
			<img src={image.src} alt={image.name} on:load={() => onImageLoad(index)} class="max-w-full" />
		{/each}
	</div>
</div>

<style>
	canvas {
		border: 1px solid black;
	}
</style>
