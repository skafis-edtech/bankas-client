<script lang="ts">
	import { Button, Dropdown } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	import type { Components } from '../../types';
	import AuthorLink from './AuthorLink.svelte';

	export let problemMetaData: Components.ProblemMetaData;
</script>

<Button class="w-5 h-5 absolute right-0 p-0"><InfoCircleOutline class="w-5 h-5" /></Button>
<Dropdown class="p-4 w-96">
	<ul>
		<li>
			<strong>Autorius: </strong><AuthorLink author={problemMetaData.author} />
		</li>
		<li><strong>Kategorija: </strong> {problemMetaData.categoryName} (bus # nuoroda)</li>
		<li><strong>Šaltinis: </strong> {problemMetaData.source} (bus nuoroda)</li>
	</ul>
</Dropdown>
