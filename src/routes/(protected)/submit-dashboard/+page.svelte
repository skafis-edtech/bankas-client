<script lang="ts">
	import { onMount } from 'svelte';
	import { type Category, type UnderReviewCategory } from '$services/gen-client';
	import { categoryApi } from '$services/apiService';
	import { currentUser } from '$lib/stores';
	import { Accordion, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import CategorySubmitted from '$components/ui/CategorySubmitted.svelte';
	import { writable, type Writable } from 'svelte/store';
	import CategoryCreate from '$components/forms/CategoryCreate.svelte';

	let loading = true;
	let error = '';

	let createState = writable(false);
	let operationDone = writable(false);

	let myUnderReviewCategories: UnderReviewCategory[] = [];
	let allPublicCategories: Category[] = [];

	async function fetchCategories() {
		loading = true;
		try {
			const response = await categoryApi.getAllPublicCategories();
			allPublicCategories = response.data;
		} catch (e: any) {
			error = e.message;
		}
		try {
			const response = await categoryApi.getMyUnderReviewCategories();
			myUnderReviewCategories = response.data;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		fetchCategories();
	});

	$: $operationDone, fetchCategories();
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Uždavinių pateikimas</h1>
	<p>Sorry, dar negalima peržiūrėti pateiktų užduočių...</p>
	{#if loading}
		<p class="text-center">Kraunasi...</p>
	{/if}
	{#if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{/if}
	<Accordion class="mt-8">
		{#each myUnderReviewCategories as category}
			<CategorySubmitted {category} {operationDone} />
		{/each}
		{#if !$createState}
			<div class="flex flex-row justify-center">
				<Button color="green" on:click={() => createState.set(true)}>Kurti naują kategoriją</Button>
			</div>
		{:else}
			<CategoryCreate {createState} {operationDone} />
		{/if}
		<div class="my-8">
			<hr class="border-y-2 border-black" />
		</div>
		{#each allPublicCategories as category}
			<CategorySubmitted {category} {operationDone} />
		{/each}
	</Accordion>
{:else}
	<p>Unauthorized</p>
{/if}
