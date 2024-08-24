<script lang="ts">
	import { SourceDisplayDtoReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Input, Popover } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, MessageDotsOutline } from 'flowbite-svelte-icons';
	import { approvalApi } from '$services/apiService';
	import { successStore } from '$lib/stores';
	import { getNiceTimeString } from '$lib/utils';
	import AuthorLink from './AuthorLink.svelte';

	export let reviewStatus: SourceDisplayDtoReviewStatusEnum;
	export let sourceId: string;
	export let reviewHistory: string;

	let id = `button-${Math.random().toString(36).substring(2, 9)}`;

	let newMessage = '';

	let bgForBar = '';
	let placeholder = '';
	if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending) {
		bgForBar = 'bg-yellow-400';
		placeholder = 'Čia galite parašyti žinutę...';
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected) {
		bgForBar = 'bg-slate-400';
		placeholder = 'Galite peržiūrėti ir papildyti kito peržiūrėtojo pastabas savomis...';
	} else if (reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved) {
		bgForBar = 'bg-slate-300';
		placeholder = 'Nieko nereikia daryti. Nebent norite atšaukti patvirtinimą...';
	} else {
		throw new Error('Unknown review status');
	}

	async function reject() {
		approvalApi.reject(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai atmesta');
		bgForBar = 'bg-slate-400';
	}

	async function approve() {
		approvalApi.approve(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai patvirtinta');
		bgForBar = 'bg-slate-300';
	}
</script>

<div class={`flex flex-row gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending}
		<Badge color="yellow" class="ml-2">Peržiūrėkite</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Rejected}
		<Badge color="red" class="ml-2">Jau atmesta</Badge>
	{/if}
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Approved}
		<Badge color="green" class="ml-2">Jau patvirtinta</Badge>
	{/if}
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
	<Input type="text" {placeholder} bind:value={newMessage} />
	<span class="flex flex-row">
		<Button color="green" on:click={approve} class="p-2 mx-1"><CheckCircleSolid /></Button>
		<Button color="red" on:click={reject} class="p-2 mx-1"><CloseCircleSolid /></Button>
	</span>
</div>
