<script lang="ts">
	import { getNiceTimeString } from '$lib/utils';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	export let problemMetaData: Components.ProblemMetaData;
</script>

<Button class="w-6 h-10 absolute right-0"><InfoCircleOutline class="w-6 h-6" /></Button>
<Dropdown class="p-4 w-96">
	<ul>
		<li><strong>Autorius: </strong>{problemMetaData.author}</li>
		<li><strong>Kategorija: </strong> {problemMetaData.categoryName}</li>
		<li><strong>Kategorijos aprašymas: </strong> {problemMetaData.categoryDescription}</li>
		<li><strong>Sukurta: </strong>{getNiceTimeString(problemMetaData.createdOn)}</li>
		<li>
			<strong>Paskutinį kartą keista: </strong>{getNiceTimeString(problemMetaData.lastModifiedOn)}
		</li>
		<li><strong>Patvirtino naudotojas: </strong>{problemMetaData.approvedBy}</li>
		<li><strong>Patvirtinta: </strong>{getNiceTimeString(problemMetaData.approvedOn)}</li>
		<li><strong>Kategorijos autorius: </strong>{problemMetaData.categoryAuthor}</li>
		<li>
			<strong>Kategorija sukurta: </strong>{getNiceTimeString(problemMetaData.categoryCreatedOn)}
		</li>
		<li>
			<strong>Kategorija paskutinį kartą keista: </strong>{getNiceTimeString(
				problemMetaData.categoryLastModifiedOn
			)}
		</li>
		<li><strong>Kategoriją patvirtino naudotojas: </strong>{problemMetaData.categoryApprovedBy}</li>
		<li>
			<strong>Kategorija patvirtinta: </strong>{getNiceTimeString(
				problemMetaData.categoryApprovedOn
			)}
		</li>
	</ul>
</Dropdown>
