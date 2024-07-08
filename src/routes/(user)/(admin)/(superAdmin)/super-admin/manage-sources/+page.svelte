<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { SourceReviewStatusEnum, type Source, type SourcePostDto } from '$services/gen-client';
	import { sourceApi } from '$services/apiService';

	let sources = writable<Source[]>([]);
	let newSource: SourcePostDto = {
		name: '',
		description: '',
		reviewStatus: SourceReviewStatusEnum.Pending,
		reviewedBy: '',
		reviewedOn: '',
		reviewMessage: '',
		author: '',
		createdOn: '',
		lastModifiedOn: ''
	};
	let editSource: Source | null = null;
	let errorMessage = '';

	const fetchSources = async () => {
		try {
			const response = await sourceApi.getAllSources();
			sources.set(response.data);
		} catch (error) {
			errorMessage = 'Failed to fetch sources';
			console.error(error);
		}
	};

	const createSource = async () => {
		try {
			await sourceApi.createSource(newSource);
			newSource = {
				name: '',
				description: '',
				reviewStatus: SourceReviewStatusEnum.Pending,
				reviewedBy: '',
				reviewedOn: '',
				reviewMessage: '',
				author: '',
				createdOn: '',
				lastModifiedOn: ''
			};
			fetchSources();
		} catch (error) {
			errorMessage = 'Failed to create source';
			console.error(error);
		}
	};

	const updateSource = async () => {
		try {
			if (editSource) {
				await sourceApi.updateSource(editSource.id, editSource);
				editSource = null;
				fetchSources();
			}
		} catch (error) {
			errorMessage = 'Failed to update source';
			console.error(error);
		}
	};

	const deleteSource = async (id: string) => {
		try {
			await sourceApi.deleteSource(id);
			fetchSources();
		} catch (error) {
			errorMessage = 'Failed to delete source';
			console.error(error);
		}
	};

	onMount(fetchSources);
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Manage firestore sources</h1>

{#if errorMessage}
	<div class="bg-red-500 text-white p-4 rounded">
		{errorMessage}
	</div>
{/if}

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Sources</h2>
	{#each $sources as source (source.id)}
		<div class="p-4 bg-white rounded shadow mb-4">
			{#if editSource && editSource.id === source.id}
				<form on:submit|preventDefault={updateSource}>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700" for="name">Name</label>
						<input
							id="name"
							type="text"
							bind:value={editSource.name}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="description" class="block text-sm font-medium text-gray-700"
							>Description</label
						>
						<textarea
							id="description"
							bind:value={editSource.description}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						></textarea>
					</div>
					<div class="mb-4">
						<label for="reviewStatus" class="block text-sm font-medium text-gray-700"
							>Review Status</label
						>
						<select
							id="reviewStatus"
							bind:value={editSource.reviewStatus}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							<option value={SourceReviewStatusEnum.Pending}>Pending</option>
							<option value={SourceReviewStatusEnum.Approved}>Approved</option>
							<option value={SourceReviewStatusEnum.Rejected}>Rejected</option>
						</select>
					</div>
					<div class="mb-4">
						<label for="reviewedBy" class="block text-sm font-medium text-gray-700"
							>Reviewed By</label
						>
						<input
							id="reviewedBy"
							type="text"
							bind:value={editSource.reviewedBy}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="reviewedOn" class="block text-sm font-medium text-gray-700"
							>Reviewed On</label
						>
						<input
							id="reviewedOn"
							type="text"
							bind:value={editSource.reviewedOn}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="reviewMessage" class="block text-sm font-medium text-gray-700"
							>Review Message</label
						>
						<input
							id="reviewMessage"
							type="text"
							bind:value={editSource.reviewMessage}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
						<input
							id="author"
							type="text"
							bind:value={editSource.author}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="createdOn" class="block text-sm font-medium text-gray-700">Created On</label
						>
						<input
							id="createdOn"
							type="text"
							bind:value={editSource.createdOn}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<div class="mb-4">
						<label for="lastModifiedOn" class="block text-sm font-medium text-gray-700"
							>Last Modified On</label
						>
						<input
							id="lastModifiedOn"
							type="text"
							bind:value={editSource.lastModifiedOn}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
					<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
					<button
						type="button"
						on:click={() => (editSource = null)}
						class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button
					>
				</form>
			{:else}
				<div class="flex justify-between items-center">
					<div>
						<h3 class="text-lg font-semibold">{source.id}</h3>
						<p class="text-gray-600"><strong>Name: </strong>{source.name}</p>
						<p class="text-gray-600"><strong>Description: </strong>{source.description}</p>
						<p class="text-gray-600"><strong>Review Status: </strong>{source.reviewStatus}</p>
						<p class="text-gray-600"><strong>Reviewed By: </strong>{source.reviewedBy}</p>
						<p class="text-gray-600"><strong>Reviewed On: </strong>{source.reviewedOn}</p>
						<p class="text-gray-600"><strong>Review Message: </strong>{source.reviewMessage}</p>
						<p class="text-gray-600"><strong>Author: </strong>{source.author}</p>
						<p class="text-gray-600"><strong>Created On: </strong>{source.createdOn}</p>
						<p class="text-gray-600"><strong>Last Modified On: </strong>{source.lastModifiedOn}</p>
					</div>
					<div>
						<button
							on:click={() => (editSource = { ...source })}
							class="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button
						>
						<button
							on:click={() => deleteSource(source.id)}
							class="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button
						>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<div class="max-w-2xl mx-auto p-4">
	<h2 class="text-2xl font-semibold mb-4">Create Source</h2>
	<form on:submit|preventDefault={createSource}>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="name">Name</label>
			<input
				id="name"
				type="text"
				bind:value={newSource.name}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="description">Description</label>
			<textarea
				id="description"
				bind:value={newSource.description}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			></textarea>
		</div>
		<div class="mb-4">
			<label for="reviewStatus" class="block text-sm font-medium text-gray-700">Review Status</label
			>
			<select
				id="reviewStatus"
				bind:value={newSource.reviewStatus}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			>
				<option value={SourceReviewStatusEnum.Pending}>Pending</option>
				<option value={SourceReviewStatusEnum.Approved}>Approved</option>
				<option value={SourceReviewStatusEnum.Rejected}>Rejected</option>
			</select>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="reviewedBy">Reviewed By</label>
			<input
				id="reviewedBy"
				type="text"
				bind:value={newSource.reviewedBy}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="reviewedOn">Reviewed On</label>
			<input
				id="reviewedOn"
				type="text"
				bind:value={newSource.reviewedOn}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="reviewMessage"
				>Review Message</label
			>
			<input
				id="reviewMessage"
				type="text"
				bind:value={newSource.reviewMessage}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
			<input
				id="author"
				type="text"
				bind:value={newSource.author}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="createdOn">Created On</label>
			<input
				id="createdOn"
				type="text"
				bind:value={newSource.createdOn}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700" for="lastModifiedOn"
				>Last Modified On</label
			>
			<input
				id="lastModifiedOn"
				type="text"
				bind:value={newSource.lastModifiedOn}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>
		<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
	</form>
</div>
