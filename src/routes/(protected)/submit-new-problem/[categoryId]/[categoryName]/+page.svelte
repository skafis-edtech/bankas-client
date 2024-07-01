<script lang="ts">
	import { currentUser } from '$lib/stores';
	import ProblemCreate from '$components/forms/ProblemCreate.svelte';
	import { Button } from 'flowbite-svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { problemApi } from '$services/apiService';

	import type { FixMyUnderReviewProblemRequest, ProblemPostDto } from '$services/gen-client';

	let categoryId: string;
	$: categoryId = get(page).params.categoryId;
	let categoryName: string;
	$: categoryName = get(page).params.categoryName;

	let problemData: Writable<ProblemPostDto> = writable({
		problemText: '',
		answerText: '',
		categoryId: '',
		problemImageUrl: '',
		answerImageUrl: ''
	});
	let problemImageFile: Writable<File | null> = writable(null);
	let answerImageFile: Writable<File | null> = writable(null);

	let loading = false;
	let error = '';

	async function submitProblem() {
		const data = $problemData;
		data.categoryId = categoryId;
		const problemImage = $problemImageFile;
		const answerImage = $answerImageFile;
		console.log(data);
		console.log(problemImage);
		console.log(answerImage);

		loading = true;
		try {
			// This is sketchy... Should be tested, but idk, I'm lazy... WOW SOME COMPLEX STUFF WITH MULTPART_FORM_DATA
			const response = await problemApi.submitProblem(
				data,
				problemImage ? problemImage : undefined,
				answerImage ? answerImage : undefined
			);
			alert('Problem submitted, id:' + response.data.id);
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}

		// // BELOW WORKS:
		// const problemData = {
		// 	problemText: 'Static example problem text',
		// 	answerText: 'Static example answer text',
		// 	categoryId: 'static-category-id'
		// };

		// // Static files (simulated with new File() for example purposes)
		// const problemImageFile = new File(['dummy content'], 'problemImage.png', { type: 'image/png' });
		// const answerImageFile = new File(['dummy content'], 'answerImage.png', { type: 'image/png' });

		// // Construct the FormData object
		// const formData = new FormData();
		// formData.append(
		// 	'problem',
		// 	new Blob([JSON.stringify(problemData)], { type: 'application/json' })
		// );
		// formData.append('problemImageFile', problemImageFile);
		// formData.append('answerImageFile', answerImageFile);

		// // Define the endpoint and token
		// const endpoint = 'http://localhost/problem/submit'; // Replace with your actual API endpoint
		// const token =
		// 	'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc5M2Y3N2Q0N2ViOTBiZjRiYTA5YjBiNWFkYzk2ODRlZTg1NzJlZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFua2FzLXNrYWZpcyIsImF1ZCI6ImJhbmthcy1za2FmaXMiLCJhdXRoX3RpbWUiOjE3MTk4MzIyOTAsInVzZXJfaWQiOiJNeURoOU5aa1d2V0J4U3h2ejRQd2NlaWdGWEYyIiwic3ViIjoiTXlEaDlOWmtXdldCeFN4dno0UHdjZWlnRlhGMiIsImlhdCI6MTcxOTgzMjI5MCwiZXhwIjoxNzE5ODM1ODkwLCJlbWFpbCI6ImNoZXNzbnJvbGxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImNoZXNzbnJvbGxAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.ZRFrae-YvxO3yBputAzl8-3wF0MhKgyL5RNud6xnXr69xCl3sJnz5F382G0LuuAts0JL-XhKShWNDJGy51I5vC-EH4IfnhGOkP8dW9y_4QaLQk6UfnD9PpTDPDfuQ3NC0NV4tboEEQsLi0hWg09_IUkJY1E7oiA97Md5OW9_RUvbHtL74LnkW3wP9urY6wyOBuvZCnHtkLK2MkcZvJodsS_Be8JtT86cqlDRtm_e8gKF-NJ4k_qStvTnzAlyHkdYiqlVDYj9iGuMwuY-4BBJA8iOdJRnME8tNHcaTeuM5WBmjhcqCxOCYYHjqxXs7Cozact8XCM1ZVglDKFIauVLuA'; // Replace with your actual token

		// // Make the fetch request
		// try {
		// 	const response = await fetch(endpoint, {
		// 		method: 'POST',
		// 		headers: {
		// 			Authorization: `Bearer ${token}`
		// 		},
		// 		body: formData
		// 	});

		// 	if (response.ok) {
		// 		const data = await response.json();
		// 		console.log('Problem submitted successfully:', data);
		// 	} else {
		// 		console.error('Error submitting problem:', response.statusText);
		// 	}
		// } catch (error) {
		// 	console.error('Error submitting problem:', error);
		// } finally {
		// 	loading = false;
		// }
	}
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Užduočių įkėlimas</h1>
	<h1 class="text-2xl font-semibold my-4 text-center">Kategorija: {categoryName}</h1>
	<p class="text-justify">
		By clicking "Submit for review" you confirm that you upload only original problems, created by
		you (which will wave your copyright rights and make it royalty-free) or problems that are
		already royalty-free. It will be reviewed by admins and if it's approved, it will be public for
		everyone to see and use (together with your username, but not email).
	</p>

	<Button on:click={() => goto('/submit-dashboard')} class="ml-4">Grįžti</Button>
	<ProblemCreate bind:problemData bind:problemImageFile bind:answerImageFile />
	<Button on:click={() => submitProblem()}>Submit problem</Button>
	{#if loading}
		<p class="text-center">Keliama...</p>
	{/if}
	{#if error}
		<p class="text-red-600 text-center">Klaida: {error}</p>
	{/if}
{:else}
	<p>Unauthorized</p>
{/if}
