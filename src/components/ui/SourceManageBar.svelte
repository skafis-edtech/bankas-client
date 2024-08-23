<script lang="ts">
	import { SourceDisplayDtoReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Popover } from 'flowbite-svelte';
	import { EditOutline, MessageDotsOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { getNiceTimeString } from '$lib/utils';
	import AuthorLink from './AuthorLink.svelte';

	export let reviewStatus: SourceDisplayDtoReviewStatusEnum;
	export let sourceId: string;
	export let reviewHistory: string;

	let id = `button-${Math.random().toString(36).substring(2, 9)}`;

	let bgForBar = '';
	if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending) {
		bgForBar = 'bg-yellow-400';
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected) {
		bgForBar = 'bg-red-400';
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved) {
		bgForBar = 'bg-green-400';
	} else {
		throw new Error('Unknown review status');
	}
</script>

<div class={`flex flex-row justify-between gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending}
		<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
		<Badge color="red" class="ml-2">Atmesta</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved}
		<Badge color="green" class="ml-2">Patvirtinta</Badge>
	{/if}
	<div class="flex flex-row justify-center">
		<Button color="primary" on:click={() => goto(`/submit/edit-source/${sourceId}`)}
			>Redaguoti</Button
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
</div>
