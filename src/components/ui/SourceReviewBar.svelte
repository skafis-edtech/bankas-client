<script lang="ts">
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

	export let reviewStatus: SourceReviewStatusEnum;

	async function reject(sourceId: string) {
		//const msg = prompt('Įveskite atmetimo priežastį (žinutę kategorijos autoriui):');
		alert('Neįgyvendinta');
	}

	async function approve(sourceId: string) {
		alert('Neįgyvendinta');
	}
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
<Button color="green" on:click={() => approve('1')} class="p-2 mx-1"><CheckCircleSolid /></Button>
<Button color="red" on:click={() => reject('1')} class="p-2 mx-1"><CloseCircleSolid /></Button>
