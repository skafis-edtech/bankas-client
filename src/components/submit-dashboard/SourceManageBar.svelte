<script lang="ts">
	import {
		SourceDisplayDtoReviewStatusEnum,
		SourceSubmitDtoVisibilityEnum
	} from '$services/gen-client';
	import { Badge, Button, Popover } from 'flowbite-svelte';
	import { MessageDotsOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { getNiceTimeString } from '$lib/utils';
	import AuthorLink from '$components/ui/AuthorLink.svelte';

	export let reviewStatus: SourceDisplayDtoReviewStatusEnum;
	export let visibility: SourceSubmitDtoVisibilityEnum;
	export let sourceId: string;
	export let reviewHistory: string;

	let id = `button-${Math.random().toString(36).substring(2, 9)}`;

	let bgForBar = '';
	if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending) {
		if (visibility === SourceSubmitDtoVisibilityEnum.Private) {
			bgForBar = 'bg-slate-400';
		} else {
			bgForBar = 'bg-yellow-400';
		}
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected) {
		bgForBar = 'bg-red-400';
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved) {
		bgForBar = 'bg-green-400';
	} else {
		throw new Error('Unknown review status');
	}
</script>

<div class={`flex flex-row justify-between gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending && visibility === SourceSubmitDtoVisibilityEnum.Public}
		<Badge color="yellow" class="ml-2">Peržiūrima</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending && visibility === SourceSubmitDtoVisibilityEnum.Private}
		<Badge color="blue" class="ml-2">Privatus</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
		<Badge color="red" class="ml-2">Atmesta</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved}
		<Badge color="green" class="ml-2">Patvirtinta</Badge>
	{/if}
	<div class="flex flex-row justify-center">
		<Button color="primary" on:click={() => goto(`/problems/edit-source/${sourceId}`)}
			>Redaguoti</Button
		>
		{#if reviewHistory !== ''}
			<Button {id} color="blue" class="p-2 mx-1 relative"><MessageDotsOutline /></Button>

			<Popover class="w-64 text-sm font-light " triggeredBy={`#${id}`} trigger="click">
				{#each reviewHistory
					.trim()
					.split('\n\n')
					.map((entry) => {
						const [timestamp, rest] = entry.trim().split(/ (.+)/); // Split into timestamp and the rest
						if (!rest) {
							console.error('Parsing error: ', entry);
							return { timestamp: 'Invalid Date', author: '', action: '', message: '' };
						}
						const [author, actionMessage] = rest.split(/ (.+)/);
						const [action, message] = actionMessage.split(':').map((s) => s.trim());
						return { timestamp, author: author.split(' ')[0], action, message };
					}) as entry}
					<p>
						{getNiceTimeString(entry.timestamp).substring(5, 16)}
						<AuthorLink author={entry.author} />
						{entry.action}{entry.message ? ': ' : ''}<strong
							>{entry.message ? entry.message : ''}</strong
						>
					</p>
				{/each}
			</Popover>
		{/if}
	</div>
</div>
