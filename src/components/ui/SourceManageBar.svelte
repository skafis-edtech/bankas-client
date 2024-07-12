<script lang="ts">
	import { getNiceTimeString } from '$lib/utils';
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Indicator, Popover } from 'flowbite-svelte';
	import { EditOutline, MessageDotsOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import AuthorLink from './AuthorLink.svelte';

	export let reviewStatus: SourceReviewStatusEnum;
	export let sourceId: string;
	export let reviewMessage: string;
	export let reviewedBy: string;
	export let reviewedOn: string;

	let messageTitle = '';
	if (reviewStatus === SourceReviewStatusEnum.Pending) {
		messageTitle = 'Ankstesniojo peržiūrėji žinutė';
	} else if (reviewStatus === SourceReviewStatusEnum.Rejected) {
		messageTitle = 'Atmetimo žinutė';
	} else if (reviewStatus === SourceReviewStatusEnum.Approved) {
		messageTitle = 'Patvirtinimo žinutė';
	} else {
		throw new Error('Unknown review status');
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
<Button
	color="yellow"
	on:click={() => alert('Neįgyvendinta. Keliaus į puslapį /edit-source/${source.id}')}
	class="p-2 mx-1"><EditOutline /></Button
>
{#if reviewMessage !== ''}
	<Button id="b1" color="blue" class="p-2 mx-1 relative"
		><MessageDotsOutline />
		{#if reviewStatus !== SourceReviewStatusEnum.Pending}
			<Indicator color="red" border size="xl" placement="top-right">
				<span class="text-white text-xs font-bold">1</span>
			</Indicator>
		{/if}
	</Button>

	<Popover class="w-64 text-sm font-light " title={messageTitle} triggeredBy="#b1"
		><p>
			{getNiceTimeString(reviewedOn)}
			<AuthorLink author={reviewedBy} /> rašė:
		</p>
		<p>{reviewMessage}</p>
	</Popover>
{/if}
