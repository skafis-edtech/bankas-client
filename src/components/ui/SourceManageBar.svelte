<script lang="ts">
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Popover } from 'flowbite-svelte';
	import { EditOutline, MessageDotsOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { getNiceTimeString } from '$lib/utils';
	import AuthorLink from './AuthorLink.svelte';

	export let reviewStatus: SourceReviewStatusEnum;
	export let sourceId: string;
	export let reviewHistory: string;

	let id = `button-${Math.random().toString(36).substring(2, 9)}`;

	let bgForBar = '';
	if (reviewStatus === SourceReviewStatusEnum.Pending) {
		bgForBar = 'bg-yellow-400';
	} else if (reviewStatus === SourceReviewStatusEnum.Rejected) {
		bgForBar = 'bg-red-400';
	} else if (reviewStatus === SourceReviewStatusEnum.Approved) {
		bgForBar = 'bg-green-400';
	} else {
		throw new Error('Unknown review status');
	}
</script>

<div class={`flex flex-row gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceReviewStatusEnum.Pending}
		<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
	{/if}
	{#if reviewStatus === SourceReviewStatusEnum.Rejected}
		<Badge color="red" class="ml-2">Atmesta</Badge>
	{/if}
	{#if reviewStatus === SourceReviewStatusEnum.Approved}
		<Badge color="green" class="ml-2">Patvirtinta</Badge>
	{/if}
	<Button color="primary" on:click={() => goto(`/submit/edit-source/${sourceId}`)} class="p-2 mx-1"
		><EditOutline /></Button
	>
	{#if reviewHistory !== ''}
		<Button {id} color="blue" class="p-2 mx-1 relative"><MessageDotsOutline /></Button>

		<Popover class="w-64 text-sm font-light " triggeredBy={`#${id}`} trigger="click">
			{#each reviewHistory.split('\\n').map((review) => {
				const [dateTime, author, ...messageParts] = review.split(' ');
				const message = messageParts.join(' ').replace('rašė:', '');
				return { dateTime, author, message };
			}) as review}
				<p>
					{getNiceTimeString(review.dateTime)}
					<AuthorLink author={review.author} />
					rašė:
					<strong>{review.message}</strong>
				</p>
			{/each}
		</Popover>
	{/if}
</div>
