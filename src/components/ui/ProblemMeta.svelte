<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	export let category;
	export let author;
	export let createdOn;
</script>

<Button class="w-6 h-10 absolute right-0"><InfoCircleOutline class="w-6 h-6" /></Button>
<Dropdown class="p-4">
	<ul>
		<li><strong>Kategorija: </strong> <a href="/">{category}</a></li>
		<li><strong>Autorius: </strong>{author}</li>
		<li><strong>Sukurta: </strong>{createdOn}</li>
	</ul>
</Dropdown>
