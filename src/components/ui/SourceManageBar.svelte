<script lang="ts">
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button } from 'flowbite-svelte';
	import { EditOutline, TrashBinSolid } from 'flowbite-svelte-icons';

	export let reviewStatus: SourceReviewStatusEnum;
</script>

{#if reviewStatus === SourceReviewStatusEnum.Pending}
	<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
{/if}
{#if reviewStatus === SourceReviewStatusEnum.Rejected}
	<Badge color="red" class="ml-2">Atmesta</Badge>
{/if}
{#if reviewStatus === SourceReviewStatusEnum.Approved}
	<Badge color="green" class="ml-2">Patvirtinta</Badge>
{/if}
<Button color="red" on:click={() => alert('Neįgyvendinta')} class="p-2 mx-1"
	><TrashBinSolid /></Button
>
<Button
	color="yellow"
	on:click={() => alert('Neįgyvendinta. Keliaus į puslapį /edit-source/${source.id}')}
	class="p-2 mx-1"><EditOutline /></Button
>
