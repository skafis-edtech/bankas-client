<script lang="ts">
	import { Button, Dropdown } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	import AuthorLink from './AuthorLink.svelte';
	import { writable } from 'svelte/store';
	import { publicApi } from '$services/apiService';
	import CategoryLink from './CategoryLink.svelte';

	export let categories: string[];
	export let sourceId: string;

	let categoriesNames = ['...'];
	let sourceName = '...';
	let author = '...';

	let isLoaded = writable(false);
	let isOpen = false;

	$: if (isOpen) {
		loadStuff();
	}

	async function loadStuff() {
		if (!isOpen || $isLoaded) return;

		if (categories && categories.length > 0) {
			categoriesNames = [];
			for (const categoryId of categories) {
				const response = await publicApi.getCategoryById(categoryId);
				categoriesNames.push(response.data.name);
			}
		} else {
			categoriesNames = ['Nesurūšiuota'];
		}

		const response = await publicApi.getSourceById1(sourceId);
		sourceName = response.data.name;
		author = response.data.authorUsername;

		isLoaded.set(true);
	}
</script>

<Button class="w-5 h-5 absolute right-0 p-0" on:click={() => (isOpen = !isOpen)}
	><InfoCircleOutline class="w-5 h-5" /></Button
>
<Dropdown class="p-4 w-96">
	<ul>
		<li>
			<strong>Autorius: </strong><AuthorLink {author} />
		</li>
		<li>
			<strong>Kategorijos: </strong>
			<ul>
				{#each categoriesNames as categoryName}
					<li><CategoryLink {categoryName} /></li>
				{/each}
			</ul>
		</li>
		<li><strong>Šaltinis: </strong> {sourceName}</li>
	</ul>
</Dropdown>
