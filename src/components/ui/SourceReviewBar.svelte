<script lang="ts">
	import { SourceReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Indicator, Input, Popover } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, MessageDotsOutline } from 'flowbite-svelte-icons';
	import AuthorLink from './AuthorLink.svelte';
	import { getNiceTimeString } from '$lib/utils';
	import { approvalApi } from '$services/apiService';
	import { successStore } from '$lib/stores';

	export let reviewStatus: SourceReviewStatusEnum;
	export let sourceId: string;
	export let reviewMessage: string;
	export let reviewedBy: string;
	export let reviewedOn: string;

	let newMessage = '';

	let messageTitle = '';
	let bgForBar = '';
	let placeholder = '';
	if (reviewStatus === SourceReviewStatusEnum.Pending) {
		messageTitle = 'Ankstesniojo peržiūrėjimo žinutė';
		bgForBar = 'bg-yellow-400';
		placeholder = 'Žinutė autoriui...';
	} else if (reviewStatus === SourceReviewStatusEnum.Rejected) {
		messageTitle = 'Atmetimo žinutė';
		bgForBar = 'bg-slate-400';
		placeholder =
			'Galite peržiūrėti ir papildyti kito peržiūrėtojo pastabas. Žinutė bus pilnai perrašyta...';
	} else if (reviewStatus === SourceReviewStatusEnum.Approved) {
		messageTitle = 'Patvirtinimo žinutė';
		bgForBar = 'bg-slate-300';
		placeholder = 'Nieko nereikia daryti. Nebent norite atšaukti patvirtinimą...';
	} else {
		throw new Error('Unknown review status');
	}

	async function reject() {
		approvalApi.reject(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai atmesta');
	}

	async function approve() {
		approvalApi.approve(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai patvirtinta');
	}
</script>

<div class={`flex flex-row gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceReviewStatusEnum.Pending}
		<Badge color="yellow" class="ml-2">Peržiūrėkite</Badge>
	{/if}
	{#if reviewStatus === SourceReviewStatusEnum.Rejected}
		<Badge color="red" class="ml-2">Jau atmesta</Badge>
	{/if}
	{#if reviewStatus === SourceReviewStatusEnum.Approved}
		<Badge color="green" class="ml-2">Jau patvirtinta</Badge>
	{/if}
	{#if reviewMessage !== ''}
		<Button id="b1" color="blue" class="p-2 mx-1 relative"><MessageDotsOutline /></Button>
		<Popover class="w-64 text-sm font-light " title={messageTitle} triggeredBy="#b1"
			><p>
				{getNiceTimeString(reviewedOn)}
				<AuthorLink author={reviewedBy} /> rašė:
			</p>
			<p>{reviewMessage}</p>
		</Popover>
	{/if}
	<Input type="text" {placeholder} bind:value={newMessage} />
	<span class="flex flex-row">
		<Button color="green" on:click={approve} class="p-2 mx-1"><CheckCircleSolid /></Button>
		<Button color="red" on:click={reject} class="p-2 mx-1"><CloseCircleSolid /></Button>
	</span>
</div>
