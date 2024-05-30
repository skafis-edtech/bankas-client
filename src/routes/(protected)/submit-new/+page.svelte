<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, type User } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let user: User | null = null;

	onMount(() => {
		const userState = get(currentUser);
		if (!userState) {
			goto('/login');
		} else {
			user = userState;
		}
	});
</script>

{#if user}
	<p>Welcome, {user.username}</p>
	<p>If you refresh, changes will not be saved</p>
	<p><a href="/submit-dashboard">Go back</a> (not saved)</p>
	<p>category1</p>
	<p>categoryName</p>
	<p>description</p>
	<p>q1</p>
	<p>questionText/image</p>
	<p>answerText/image</p>
	<p>q2</p>
	<p>questionText/image</p>
	<p>answerText/image</p>
	<p>+</p>
	<p>
		Upload only original problems, created by you (which will wave your copyright rights and make it
		royalty-free) or problems that are already royalty-free. It will be reviewed by admins and if
		it's approved, it will be public for everyone to see (together with your username, but not
		email) and use.
	</p>
	<button>submit for review</button>
{/if}
