<script lang="ts">
	import { getNiceTimeString } from '$lib/utils';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	export let problemMetaData: Components.ProblemMetaData;
</script>

<Button class="w-5 h-5 absolute right-0 p-0"><InfoCircleOutline class="w-5 h-5" /></Button>
<Dropdown class="p-4 w-96">
	<ul>
		<li>
			<strong>Autorius: </strong><a href="/user/{problemMetaData.author}" class="underline"
				>{problemMetaData.author}</a
			>
		</li>
		<li><strong>Kategorija: </strong> {problemMetaData.categoryName} (bus # nuoroda)</li>
		<li><strong>Šaltinis: </strong> {problemMetaData.source} (bus nuoroda)</li>
	</ul>
</Dropdown>
